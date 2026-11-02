'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { replaceLoginWithRedirect } from '@/util/loginRedirect';
import { fetchBackendClient, fetchBackendClientJson } from '@/util/fetch/client';
import { academicTerm2string } from '@/util/helper/tostring';
import { getAttachmentDownloadUrl } from '@/util/getAttachmentDownloadUrl';
import { useMe } from '@/util/hooks/useMe';
import { getCurrentTerm, getPrevTerm } from '@/util/helper/system';
import { uploadCompressedImage } from '@/util/fetch/imageUpload';

import styles from './form.module.css';
import { GlobalStatus } from '@/types/system';

import { FUND_APPLY_GUIDELINE_LINK } from '@/util/constants';
const IMAGE_UPLOAD_CONCURRENCY = 3;
const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

type FormType = {
  applyType: 'contest' | 'fund' | 'meal' | 'pair' | '';
  orgCategory: 'sig' | 'pig' | '';
  target: string;
  contestName: string;
  pairBefore: string;
  pairAfter: string;
  amount: string;
  useKakaoPay: boolean;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  checked: boolean;
  reasonText: string;
  imageIds: string[];
  attachmentIds: string[];
};

function replaceCRLF_LF(s: string): string {
  if (typeof s !== 'string') return '';
  return s.replace(/\r\n/g, '\n');
}

function extractFirstText(v: any) {
  if (typeof v === 'string') return v.trim();
  if (v && typeof v === 'object') {
    if (typeof v.text === 'string') return v.text.trim();
    if (typeof v.title === 'string') return v.title.trim();
    if (typeof v.name === 'string') return v.name.trim();
    if (typeof v.label === 'string') return v.label.trim();
  }
  return '';
}

type SigItem = { id: number; title: string };

function refinineSigList(sigList: any[]): SigItem[] {
  if (!Array.isArray(sigList)) return [];
  return sigList
    .map((sig) => ({
      id: sig.id,
      title: sig.title,
    }))
    .filter((sig) => sig.title);
}

export default function FundApplyForm({
  boardId,
  globalStatus,
}: {
  boardId: number;
  globalStatus: GlobalStatus;
}) {
  const router = useRouter();
  const t = useTranslations('UsFundApply');
  const locale = useLocale();
  const instructionsByType = {
    contest: t('instructions.contest'),
    fund: t('instructions.fund'),
    meal: t('instructions.meal'),
    pair: t('instructions.pair'),
  };
  const { me: user, isLoading: isMeLoading, isUnauthenticated } = useMe();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [imageIds, setImageIds] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [attachmentItems, setAttachmentItems] = useState<
    { id: string; original_filename: string }[]
  >([]);
  const [attachmentUploading, setAttachmentUploading] = useState(false);

  const currTerm = getCurrentTerm(globalStatus);
  const prevTerm = getPrevTerm(currTerm);
  const _curr = new URLSearchParams({
    year: String(currTerm.year),
    semester: String(currTerm.semester),
  }).toString();
  const [currSigs, setCurrSigs] = useState<SigItem[]>([]);
  const [currPigs, setCurrPigs] = useState<SigItem[]>([]);

  const _prev = new URLSearchParams({
    year: String(prevTerm.year),
    semester: String(prevTerm.semester),
  }).toString();
  const [prevSigs, setPrevSigs] = useState<SigItem[]>([]);
  const [prevPigs, setPrevPigs] = useState<SigItem[]>([]);

  const [sigList, setSigList] = useState<SigItem[]>([]);

  const [usePrevTerm, setUsePrevTerm] = useState<boolean>(false);
  const prevTermLabel = academicTerm2string(prevTerm);
  const displayPrevTermLabel =
    locale === 'en-US' ? `${prevTerm.year}, semester ${prevTerm.semester}` : prevTermLabel;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      applyType: '',
      orgCategory: '',
      target: '',
      contestName: '',
      pairBefore: '',
      pairAfter: '',
      amount: '',
      useKakaoPay: false,
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      checked: false,
      reasonText: '',
      imageIds: [],
      attachmentIds: [],
    },
  });

  const applyType = watch('applyType');
  const orgCategory = watch('orgCategory');
  const isChecked = watch('checked');
  const useKakaoPay = watch('useKakaoPay');
  const uploadDisabled = isMeLoading || isUnauthenticated || !user || submitting;

  useEffect(() => {
    if (isMeLoading) return;
    if (isUnauthenticated || !user) {
      replaceLoginWithRedirect(router);
      return;
    }
  }, [router, user, isMeLoading, isUnauthenticated]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        const [currSigData, currPigData, prevSigData, prevPigData] = await Promise.all([
          fetchBackendClientJson<any[]>(`/api/sigs?${_curr}&tag=SIG`),
          fetchBackendClientJson<any[]>(`/api/sigs?${_curr}&tag=PIG`),
          fetchBackendClientJson<any[]>(`/api/sigs?${_prev}&tag=SIG`),
          fetchBackendClientJson<any[]>(`/api/sigs?${_prev}&tag=PIG`),
        ]);
        if (isMounted) {
          setCurrSigs(refinineSigList(currSigData));
          setCurrPigs(refinineSigList(currPigData));
          setPrevSigs(refinineSigList(prevSigData));
          setPrevPigs(refinineSigList(prevPigData));
        }
      } catch (err) {
        console.error(err);
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [_curr, _prev]);

  useEffect(() => {
    if (applyType !== 'fund' && applyType !== 'meal') {
      setUsePrevTerm(false);
    }
    if (applyType === 'contest' || applyType === 'pair') {
      setValue('orgCategory', '', { shouldValidate: true, shouldDirty: true });
      setValue('target', '', { shouldValidate: true, shouldDirty: true });
    }
    if (applyType !== 'contest') setValue('contestName', '');
    if (applyType !== 'pair') {
      setValue('pairBefore', '');
      setValue('pairAfter', '');
    }

    setValue('reasonText', '', { shouldValidate: true, shouldDirty: true });
    setImageIds([]);
    setValue('imageIds', [], { shouldValidate: true, shouldDirty: true });
    setAttachmentItems([]);
    setValue('attachmentIds', [], { shouldValidate: true, shouldDirty: true });
  }, [applyType, setValue]);

  useEffect(() => {
    if (orgCategory === 'sig') {
      setSigList(usePrevTerm ? prevSigs : currSigs);
    } else if (orgCategory === 'pig') {
      setSigList(usePrevTerm ? prevPigs : currPigs);
    } else {
      setSigList([]);
    }
  }, [orgCategory, usePrevTerm, currSigs, currPigs, prevSigs, prevPigs]);

  const disableOrgSelects: boolean =
    isMeLoading || submitting || applyType === 'contest' || applyType === 'pair';

  const step1Done = Boolean(applyType);
  const step2Ready = step1Done;
  const step2CheckMap: Record<string, () => boolean> = {
    contest: () => Boolean(watch('contestName')),
    pair: () => Boolean(watch('pairBefore') && watch('pairAfter')),
    default: () => Boolean(orgCategory && watch('target')),
  };
  const step2Done = step2CheckMap[applyType || '']?.() ?? step2CheckMap.default();
  const step3Ready = step2Done;

  const computeTitle = (form: FormType) => {
    if (form.applyType === 'contest') {
      const name = extractFirstText(form.contestName) || '대회명 없음';
      return `[대회] ${name}`;
    }

    if (form.applyType === 'pair') {
      const before = extractFirstText(form.pairBefore);
      const after = extractFirstText(form.pairAfter);
      return `[짝후] ${before}${before && after ? ' → ' : ''}${after}`;
    }

    const target = extractFirstText(form.target);
    const typeLabel = form.applyType === 'meal' ? '회식비' : '지원금';
    return `[${typeLabel}] ${target || 'SIG/PIG'}`;
  };

  const buildPayload = (form: FormType) => {
    if (!user) throw new Error(t('userLoading'));
    const title = computeTitle(form);

    const userName = user.name;
    const StudentId = user.student_id;

    const headerLines = [];
    headerLines.push(`# ${title}`);
    headerLines.push(`- 신청자: ${userName}(${StudentId})`);

    if (form.applyType === 'contest') {
      headerLines.push('- 유형: 대회 지원');
      headerLines.push(`- 대회명: ${extractFirstText(form.contestName)}`);
    } else if (form.applyType === 'pair') {
      headerLines.push('- 유형: 짝후 지원');
      headerLines.push(
        `- 짝선/짝후: ${extractFirstText(form.pairBefore)} → ${extractFirstText(form.pairAfter)}`,
      );
    } else {
      headerLines.push(
        `- 유형: ${form.applyType === 'meal' ? 'SIG/PIG 회식비' : 'SIG/PIG 지원금'}`,
      );
      headerLines.push(`- 대상 유형: ${form.orgCategory?.toUpperCase?.() ?? ''}`);
      headerLines.push(`- 대상: ${extractFirstText(form.target)}`);
      headerLines.push(
        `- 학기: ${usePrevTerm && prevTermLabel ? `이전학기(${prevTermLabel})` : '이번학기'}`,
      );
    }

    if (
      form.applyType === 'fund' ||
      form.applyType === 'meal' ||
      form.applyType === 'contest'
    ) {
      headerLines.push(`- 신청 금액: ${String(form.amount ?? '').trim()}원`);
      headerLines.push(`- 수령 방식: ${form.useKakaoPay ? '카카오페이' : '계좌이체'}`);

      if (!form.useKakaoPay) {
        const bank = extractFirstText(form.bankName);
        const acc = String(form.accountNumber ?? '').trim();
        const holder = extractFirstText(form.accountHolder);

        if (bank) headerLines.push(`- 은행: ${bank}`);
        if (acc) headerLines.push(`- 계좌번호: ${acc}`);
        if (holder) headerLines.push(`- 예금주: ${holder}`);
      }
    }

    const reason = replaceCRLF_LF(String(form.reasonText ?? '')).trim();
    const imageIds = (Array.isArray(form.imageIds) ? form.imageIds : []).filter(Boolean);
    const attachmentIds = (Array.isArray(form.attachmentIds) ? form.attachmentIds : []).filter(
      Boolean,
    );
    const imgs = imageIds.map((id) => `![image](${buildImageUrl(id)})`);

    const blocks = [];
    blocks.push(`${headerLines.join('\n')}\n\n---\n`);
    blocks.push(`## 지원 사유/기타\n\n${reason}\n`);
    if (imgs.length > 0) blocks.push(`\n## 첨부 이미지\n\n${imgs.join('\n')}\n`);

    return {
      title,
      content: blocks.join('\n').trim(),
      attachments: [...imageIds, ...attachmentIds],
    };
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const uploaded = await uploadCompressedImage(file);

    if (!uploaded?.id) return null;

    return String(uploaded.id);
  };

  const uploadImages = async (files: File[]) => {
    if (files.length === 0 || imageUploading) return;

    setImageUploading(true);
    try {
      const ids: string[] = [];
      for (let i = 0; i < files.length; i += IMAGE_UPLOAD_CONCURRENCY) {
        const chunk = files.slice(i, i + IMAGE_UPLOAD_CONCURRENCY);
        const results = await Promise.all(chunk.map(uploadImage));
        ids.push(...results.filter((id): id is string => id !== null));
      }
      if (ids.length === 0) return;
      const next = Array.from(new Set([...imageIds, ...ids]));
      setImageIds(next);
      setValue('imageIds', next, { shouldValidate: true, shouldDirty: true });
    } finally {
      setImageUploading(false);
    }
  };

  const removeImageId = (id: string) => {
    const next = imageIds.filter((x) => x !== id);
    setImageIds(next);
    setValue('imageIds', next, { shouldValidate: true, shouldDirty: true });
  };

  const MAX_ATTACHMENT_BYTES = 10_000_000;

  const uploadAttachment = async (
    file: File,
  ): Promise<{ id: string; original_filename: string } | null> => {
    if (file.size > MAX_ATTACHMENT_BYTES) {
      alert(t('fileTooLarge'));
      return null;
    }
    const formData = new FormData();
    formData.append('file', file);

    let res: Response;
    try {
      res = await fetchBackendClient('/api/file/docs/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
    } catch {
      alert(t('uploadError'));
      return null;
    }

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      if (res.status === 401) {
        alert(t('uploadError'));
      } else {
        alert(data?.detail || data?.message || t('uploadFailed', { status: res.status }));
      }
      return null;
    }

    if (!data?.id) {
      alert(t('uploadIdMissing'));
      return null;
    }

    return {
      id: String(data.id),
      original_filename: data.original_filename || file.name,
    };
  };

  const uploadAttachments = async (files: File[]) => {
    if (files.length === 0 || attachmentUploading) return;

    setAttachmentUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const item = await uploadAttachment(file);
        if (item) uploaded.push(item);
      }
      if (uploaded.length === 0) return;

      const mergedItems = [...attachmentItems];
      const seen = new Set(mergedItems.map((item) => item.id));
      for (const item of uploaded) {
        if (seen.has(item.id)) continue;
        mergedItems.push(item);
        seen.add(item.id);
      }

      setAttachmentItems(mergedItems);
      setValue(
        'attachmentIds',
        mergedItems.map((item) => item.id),
        { shouldValidate: true, shouldDirty: true },
      );
    } finally {
      setAttachmentUploading(false);
    }
  };

  const removeAttachmentId = (id: string) => {
    const nextItems = attachmentItems.filter((item) => item.id !== id);
    setAttachmentItems(nextItems);
    setValue(
      'attachmentIds',
      nextItems.map((item) => item.id),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const onSubmit = async (form: FormType) => {
    try {
      if (isMeLoading) return;
      setSubmitting(true);

      if (!user) throw new Error(t('userLoading'));
      if (!boardId) throw new Error(t('invalidBoard'));

      const reason = String(form.reasonText ?? '').trim();
      if (!reason) throw new Error(t('reasonRequired'));
      if (!Array.isArray(form.imageIds) || form.imageIds.length === 0)
        throw new Error(t('imageRequired'));

      const payload = await buildPayload(form);

      const res = await fetchBackendClient('/api/article/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: payload.title,
          content: payload.content,
          board_id: boardId,
          attachments: payload.attachments,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || t('applicationFailed', { status: res.status }));
      }

      alert(t('completed'));
      router.replace(`/`);
    } catch (e) {
      const msg = t('submissionError', { message: e instanceof Error ? e.message : 'unknown' });
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.CreateSigContainer}>
      <div className={styles.CreateSigHeader}>
        <h1 className={styles.CreateSigTitle}>{t('title')}</h1>
        <p className={styles.CreateSigSubtitle}>{t('subtitle')}</p>
      </div>

      <div className={styles.CreateSigCard}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles['space-y-10']}>
          <fieldset
            className={styles['space-y-10']}
            disabled={isMeLoading}
            style={{ border: 0, margin: 0, padding: 0 }}
          >
            <div className={cx(styles.Step, styles['fade-in'], styles['space-y-4'])}>
              <div>
                <label className={styles.C_Label}>{t('type')}</label>
                <select
                  {...register('applyType', { required: true })}
                  className={cx(
                    styles.C_Input,
                    (isMeLoading || submitting) && styles['is-disabled'],
                  )}
                  disabled={isMeLoading || submitting}
                  defaultValue=""
                >
                  <option className={styles.C_InputOption} value="">
                    {t('select')}
                  </option>
                  <option className={styles.C_InputOption} value="fund">
                    {t('fund')}
                  </option>
                  <option className={styles.C_InputOption} value="meal">
                    {t('meal')}
                  </option>
                  <option className={styles.C_InputOption} value="contest">
                    {t('contest')}
                  </option>
                  <option className={styles.C_InputOption} value="pair">
                    {t('pair')}
                  </option>
                </select>
              </div>
            </div>

            {step2Ready && (
              <div className={cx(styles.Step, styles['fade-in'], styles['space-y-4'])}>
                {applyType === 'contest' || applyType === 'pair' ? (
                  applyType === 'contest' ? (
                    <div>
                      <label className={styles.C_Label}>{t('contestName')}</label>
                      <input
                        {...register('contestName', { required: true })}
                        placeholder={t('contestNamePlaceholder')}
                        className={styles.C_Input}
                        disabled={submitting}
                      />
                    </div>
                  ) : (
                    <div className={styles.twoColumnGrid}>
                      <div>
                        <label className={styles.C_Label}>{t('pairBefore')}</label>
                        <input
                          {...register('pairBefore', { required: true })}
                          placeholder={t('pairBeforePlaceholder')}
                          className={styles.C_Input}
                          disabled={submitting}
                        />
                      </div>
                      <div>
                        <label className={styles.C_Label}>{t('pairAfter')}</label>
                        <input
                          {...register('pairAfter', { required: true })}
                          placeholder={t('pairAfterPlaceholder')}
                          className={styles.C_Input}
                          disabled={submitting}
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <div className={styles['space-y-4']}>
                    <div>
                      <label className={styles.C_Label}>{t('orgType')}</label>
                      <div className={styles.SigPigControlRow}>
                        <select
                          {...register('orgCategory', { required: true })}
                          className={cx(
                            styles.C_Input,
                            disableOrgSelects && styles['is-disabled'],
                          )}
                          disabled={disableOrgSelects}
                          defaultValue=""
                        >
                          <option className={styles.C_InputOption} value="">
                            {t('orgSelect')}
                          </option>
                          <option className={styles.C_InputOption} value="sig">
                            SIG
                          </option>
                          <option className={styles.C_InputOption} value="pig">
                            PIG
                          </option>
                        </select>

                        {(applyType === 'fund' || applyType === 'meal') && (
                          <label className={styles.PrevTermInlineCheck}>
                            <input
                              type="checkbox"
                              className={styles.C_Checkbox}
                              checked={usePrevTerm}
                              onChange={(e) => {
                                const next = e.target.checked;
                                setUsePrevTerm(next);
                                setValue('target', '', {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }}
                              disabled={disableOrgSelects || !prevTerm}
                            />
                            <span>
                              {t('previousTerm')}
                              {displayPrevTermLabel ? ` (${displayPrevTermLabel})` : ''}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className={styles.C_Label}>{t('targetSelectLabel')}</label>
                      <select
                        {...register('target', { required: true })}
                        className={cx(
                          styles.C_Input,
                          disableOrgSelects && styles['is-disabled'],
                        )}
                        disabled={disableOrgSelects}
                        defaultValue=""
                      >
                        <option className={styles.C_InputOption} value="">
                          {t('targetSelectLabel')}
                        </option>
                        {sigList.length === 0 ? (
                          <option className={styles.C_InputOption} disabled>
                            {t('noTargets')}
                          </option>
                        ) : (
                          sigList.map((item, idx) => (
                            <option
                              className={styles.C_InputOption}
                              key={`${item.id ?? 'na'}-${item.title}-${idx}`}
                              value={item.title}
                            >
                              {item.title}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step3Ready && (
              <div className={cx(styles.Step, styles['fade-in'], styles['space-y-8'])}>
                {(applyType === 'fund' || applyType === 'meal' || applyType === 'contest') && (
                  <div className={styles.PayoutSection}>
                    <div className={styles.PayoutHeader}>
                      <label className={styles.C_Label}>{t('amount')}</label>
                    </div>

                    <div className={cx(styles.PayoutField, styles['max-w-md'])}>
                      <input
                        id="fund-amount-input"
                        type="number"
                        {...register('amount', { required: t('amountRequired') })}
                        placeholder={t('amountExample')}
                        className={cx(styles.C_Input, styles.FundAmountInput)}
                        disabled={submitting}
                      />
                      {errors.amount?.message && (
                        <p style={{ marginTop: '0.5rem' }}>{String(errors.amount.message)}</p>
                      )}
                    </div>

                    <div>
                      <label className={styles.C_CheckRow}>
                        <input
                          type="checkbox"
                          className={styles.C_Checkbox}
                          {...register('useKakaoPay')}
                          disabled={submitting}
                        />
                        <span className={styles.C_CheckText}>{t('kakaoPay')}</span>
                      </label>
                    </div>

                    {!useKakaoPay && (
                      <div className={styles.PayoutGrid}>
                        <div className={styles.PayoutField}>
                          <label className={styles.C_SubLabel} htmlFor="fund-bank-input">
                            {t('bank')}
                          </label>
                          <input
                            id="fund-bank-input"
                            type="text"
                            {...register('bankName')}
                            placeholder={t('bankPlaceholder')}
                            className={styles.C_Input}
                            disabled={useKakaoPay || submitting}
                          />
                        </div>

                        <div className={styles.PayoutField}>
                          <label className={styles.C_SubLabel} htmlFor="fund-account-input">
                            {t('accountNumber')}
                          </label>
                          <input
                            id="fund-account-input"
                            type="text"
                            {...register('accountNumber', {
                              pattern: {
                                value: /^[0-9-]+$/,
                                message: t('accountNumberInvalid'),
                              },
                            })}
                            placeholder={t('accountPlaceholder')}
                            className={cx(styles.C_Input, styles.FundAccountInput)}
                            disabled={useKakaoPay || submitting}
                          />
                          {errors.accountNumber?.message && (
                            <p style={{ marginTop: '0.5rem' }}>
                              {String(errors.accountNumber.message)}
                            </p>
                          )}
                        </div>

                        <div className={styles.PayoutField}>
                          <label className={styles.C_SubLabel} htmlFor="fund-holder-input">
                            {t('accountHolder')}
                          </label>
                          <input
                            id="fund-holder-input"
                            type="text"
                            {...register('accountHolder')}
                            placeholder={t('holderPlaceholder')}
                            className={styles.C_Input}
                            disabled={useKakaoPay || submitting}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <div>
                    <label className={styles.C_Label}>{t('details')}</label>
                  </div>

                  <div className={styles.EditorWrapper}>
                    <div>
                      <div className={styles.EditorPlaceholderText}>
                        {(applyType ? instructionsByType[applyType] : '').trim()}
                      </div>

                      <div style={{ marginTop: '1rem' }}>
                        <label className={styles.C_Label}>{t('imageAttachments')}</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className={cx(styles.C_Input, styles.FileInput)}
                          disabled={uploadDisabled || imageUploading}
                          onChange={async (e) => {
                            const picked = Array.from(e.target.files || []);
                            e.target.value = '';
                            await uploadImages(picked);
                          }}
                        />

                        <input
                          type="hidden"
                          {...register('imageIds', {
                            validate: (v) =>
                              Array.isArray(v) && v.length > 0 ? true : t('imageRequired'),
                          })}
                        />

                        {errors.imageIds?.message && (
                          <p style={{ marginTop: '0.25rem' }}>
                            {String(errors.imageIds.message)}
                          </p>
                        )}

                        {imageIds.length > 0 && (
                          <div style={{ marginTop: '0.5rem' }}>
                            {imageIds.map((id) => (
                              <div
                                key={id}
                                style={{
                                  display: 'flex',
                                  gap: '0.5rem',
                                  alignItems: 'center',
                                  marginTop: '0.25rem',
                                }}
                              >
                                <a
                                  className={styles.C_Link}
                                  href={buildImageUrl(id)}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {id}
                                </a>
                                <button
                                  type="button"
                                  className={styles.C_Link}
                                  onClick={() => removeImageId(id)}
                                  disabled={uploadDisabled || imageUploading}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                  }}
                                >
                                  {t('delete')}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: '1rem' }}>
                        <input type="hidden" {...register('attachmentIds')} />
                        <label className={styles.C_Label}>{t('fileAttachments')}</label>
                        <input
                          type="file"
                          multiple
                          className={cx(styles.C_Input, styles.FileInput)}
                          disabled={uploadDisabled || attachmentUploading}
                          onChange={async (e) => {
                            const picked = Array.from(e.target.files || []);
                            e.target.value = '';
                            await uploadAttachments(picked);
                          }}
                        />

                        {attachmentItems.length > 0 && (
                          <div style={{ marginTop: '0.5rem' }}>
                            {attachmentItems.map((item) => (
                              <div
                                key={item.id}
                                style={{
                                  display: 'flex',
                                  gap: '0.5rem',
                                  alignItems: 'center',
                                  marginTop: '0.25rem',
                                }}
                              >
                                <a
                                  className={styles.C_Link}
                                  href={getAttachmentDownloadUrl(item.id)}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {item.original_filename || item.id}
                                </a>
                                <button
                                  type="button"
                                  className={styles.C_Link}
                                  onClick={() => removeAttachmentId(item.id)}
                                  disabled={uploadDisabled || attachmentUploading}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                  }}
                                >
                                  {t('delete')}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: '1rem' }}>
                        <label className={styles.C_Label}>{t('reason')}</label>
                        <textarea
                          {...register('reasonText', {
                            required: t('reasonRequired'),
                            validate: (v) =>
                              String(v ?? '').trim().length > 0 || t('reasonRequired'),
                          })}
                          placeholder={t('reasonPlaceholder')}
                          className={styles.C_Input}
                          disabled={submitting}
                          rows={8}
                          style={{ resize: 'vertical' }}
                        />
                        {errors.reasonText?.message && (
                          <p style={{ marginTop: '0.25rem' }}>
                            {String(errors.reasonText.message)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <label className={styles.C_CheckRow} style={{ marginTop: '1rem' }}>
                    <input
                      type="checkbox"
                      {...register('checked', {
                        required: t('guidelineRequired'),
                      })}
                      className={styles.C_Checkbox}
                      disabled={submitting}
                    />
                    <span className={styles.C_CheckText}>
                      <a
                        href={FUND_APPLY_GUIDELINE_LINK}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.C_Link}
                      >
                        {t('guidelineLink')}
                      </a>
                      {t('guidelineAcknowledged')}
                    </span>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    className={styles.SigCreateBtn}
                    disabled={
                      !isChecked ||
                      isMeLoading ||
                      !user ||
                      submitting ||
                      imageUploading ||
                      attachmentUploading
                    }
                  >
                    {submitting ? t('submitting') : t('apply')}
                  </button>
                </div>
              </div>
            )}
          </fieldset>
        </form>
      </div>
    </div>
  );
}

function buildImageUrl(id: string): string {
  const PUBLIC_FRONTEND_URL = window.location.origin;
  const relative = `/api/file/image/download/${encodeURIComponent(id)}`;
  return `${PUBLIC_FRONTEND_URL}${relative}`;
}
