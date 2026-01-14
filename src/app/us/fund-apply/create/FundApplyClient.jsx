'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { SEMESTER_MAP } from '@/util/constants';
import { replaceLoginWithRedirect } from '@/util/loginRedirect';

import './page.css';

const GUIDE_URL =
  'https://github.com/scsc-init/homepage_init/blob/master/%EC%9A%B4%EC%98%81%EB%B0%A9%EC%B9%A8/%EC%A7%80%EC%9B%90%EA%B8%88_%EC%8B%A0%EC%B2%AD_%EC%95%88%EB%82%B4%EC%82%AC%ED%95%AD.md';

const PLACEHOLDER = {
  contest: `아래 항목을 참고해 상세 내용을 작성해주세요.

승인 절차: 임원진 검토 후 승인
지원 한도: 회원 당 20,000원. 단, 숙박이 필요한 경우 40,000원
대회의 참여를 증빙할 수 있는 자료를 첨부하여야 합니다.
팀의 80% 이상이 정회원이여야 합니다.
대회에 최소한의 진입장벽이 존재해야 합니다. 대회에 참여하기 위해서 '대회 참가 신청' 외 예선전 통과나 예비선발과정 합격 등의 추가적인 절차가 있어야 합니다. ex. ICPC 본선, 반도체 아이디어 경진대회 본선
`,
  fund: `아래 항목을 참고해 상세 내용을 작성해주세요.

승인 절차: 임원진 검토 후 승인
지원 한도: SIG 당 50,000원
지원 한도: PIG 한도 없음
반드시 결제가 이루어지기 전에 승인이 이루어져야 합니다.
지원이 필요한 SIG 또는 PIG 명을 밝혀야 합니다.
`,
  meal: `아래 항목을 참고해 상세 내용을 작성해주세요.

승인 절차: 임원진 검토 후 승인
지원 한도: SIG 당 50,000원
지원 한도: PIG 한도 없음
반드시 결제가 이루어지기 전에 승인이 이루어져야 합니다.
회식비 지원이 필요한 SIG 또는 PIG 명을 밝혀야 합니다.
`,
  pair: `아래 항목을 참고해 상세 내용을 작성해주세요.

승인 절차: 임원진 검토 후 승인
지원 한도: 회원 당 20,000원
짝후/짝선 관계가 유효해야 합니다.
`,
};

function normalizeLF(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/\r\n/g, '\n');
}

function extractFirstText(v) {
  if (typeof v === 'string') return v.trim();
  if (v && typeof v === 'object') {
    if (typeof v.text === 'string') return v.text.trim();
    if (typeof v.title === 'string') return v.title.trim();
    if (typeof v.name === 'string') return v.name.trim();
    if (typeof v.label === 'string') return v.label.trim();
  }
  return '';
}

export default function FundApplyClient({
  boardInfo,
  sigs,
  pigs,
  prevSigs,
  prevPigs,
  globalStatus,
  prevTerm: prevTermProp,
}) {
  const router = useRouter();

  const [initLoading, setInitLoading] = useState(true);
  const [initError, setInitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [me, setMe] = useState(null);

  const [imageIds, setImageIds] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
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
    },
  });

  const applyType = watch('applyType');
  const orgCategory = watch('orgCategory');
  const isChecked = watch('checked');
  const useKakaoPay = watch('useKakaoPay');

  const [showPrevTerm, setShowPrevTerm] = useState(false);

  const semesterToKo = (s) => {
    const v = SEMESTER_MAP?.[s];
    if (!v) return '';
    return `${v}학기`;
  };

  const normalizeTargets = (items) => {
    if (!Array.isArray(items)) return [];
    return items
      .map((it) => ({
        id: it?.id ?? it?.sig_id ?? it?.pig_id ?? it?.uuid ?? it?.key ?? null,
        title: it?.title ?? it?.name ?? it?.label ?? '',
        year: typeof it?.year === 'number' ? it.year : it?.year ? Number(it.year) : null,
        semester:
          typeof it?.semester === 'number'
            ? it.semester
            : it?.semester
              ? Number(it.semester)
              : null,
        status: it?.status ?? null,
      }))
      .filter((it) => it.title);
  };

  const currentTerm = useMemo(() => {
    const y = globalStatus?.year;
    const s = globalStatus?.semester;
    if (typeof y === 'number' && typeof s === 'number') return { year: y, semester: s };
    return null;
  }, [globalStatus?.year, globalStatus?.semester]);

  const prevTerm = useMemo(() => {
    if (
      prevTermProp &&
      typeof prevTermProp.year === 'number' &&
      typeof prevTermProp.semester === 'number'
    )
      return prevTermProp;
    if (!currentTerm) return null;
    if (currentTerm.semester === 1) return { year: currentTerm.year - 1, semester: 4 };
    return { year: currentTerm.year, semester: currentTerm.semester - 1 };
  }, [prevTermProp, currentTerm]);

  const prevTermLabel = prevTerm ? `${prevTerm.year}년 ${semesterToKo(prevTerm.semester)}` : '';

  const sigsList = useMemo(() => normalizeTargets(sigs), [sigs]);
  const pigsList = useMemo(() => normalizeTargets(pigs), [pigs]);
  const prevSigsList = useMemo(() => normalizeTargets(prevSigs), [prevSigs]);
  const prevPigsList = useMemo(() => normalizeTargets(prevPigs), [prevPigs]);

  const [targetList, setTargetList] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        setInitLoading(true);
        setInitError('');

        const res = await fetch('/api/user/profile', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status === 401) {
            replaceLoginWithRedirect(router);
            return;
          }
          throw new Error(`프로필 조회 실패 (${res.status})`);
        }

        const data = await res.json();
        if (!data || typeof data !== 'object')
          throw new Error('프로필 응답이 올바르지 않습니다.');

        setMe(data);
      } catch (e) {
        setInitError(e?.message ? String(e.message) : '초기화 중 오류가 발생했습니다.');
      } finally {
        setInitLoading(false);
      }
    };

    init();
  }, [router]);

  useEffect(() => {
    if (applyType !== 'fund' && applyType !== 'meal') {
      setShowPrevTerm(false);
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
  }, [applyType, setValue]);

  useEffect(() => {
    if (orgCategory === 'sig') {
      setTargetList(showPrevTerm ? prevSigsList : sigsList);
    } else if (orgCategory === 'pig') {
      setTargetList(showPrevTerm ? prevPigsList : pigsList);
    } else {
      setTargetList([]);
    }
  }, [orgCategory, showPrevTerm, sigsList, pigsList, prevSigsList, prevPigsList]);

  const disableOrgSelects = submitting || applyType === 'contest' || applyType === 'pair';

  const step1Done = Boolean(applyType);
  const step2Ready = step1Done;
  const step2Done =
    applyType === 'contest'
      ? Boolean(watch('contestName'))
      : applyType === 'pair'
        ? Boolean(watch('pairBefore')) && Boolean(watch('pairAfter'))
        : Boolean(orgCategory) && Boolean(watch('target'));

  const step3Ready = step2Done;

  const computeTitle = (form) => {
    if (form.applyType === 'contest') {
      const name = extractFirstText(form.contestName) || '대회 지원';
      return `[대회] ${name}`;
    }
    if (form.applyType === 'pair') {
      const before = extractFirstText(form.pairBefore);
      const after = extractFirstText(form.pairAfter);
      return `[짝후] ${before}${before && after ? '→' : ''}${after}`;
    }
    const target = extractFirstText(form.target);
    const typeLabel = form.applyType === 'meal' ? '회식' : '지원';
    return `[${typeLabel}] ${target || 'SIG/PIG'}`;
  };

  const buildPayload = (form) => {
    const title = computeTitle(form);
    const applicantName = me?.name ?? '';
    const applicantStudentId = me?.student_id ?? me?.studentId ?? '';

    const headerLines = [];
    headerLines.push(`# ${title}`);
    if (applicantName || applicantStudentId) {
      headerLines.push(
        `- 신청자: ${applicantName}${applicantStudentId ? ` (${applicantStudentId})` : ''}`,
      );
    }

    if (form.applyType === 'contest') {
      headerLines.push(`- 유형: 대회 지원`);
      headerLines.push(`- 대회명: ${extractFirstText(form.contestName)}`);
    } else if (form.applyType === 'pair') {
      headerLines.push(`- 유형: 짝후 지원`);
      headerLines.push(
        `- 짝: ${extractFirstText(form.pairBefore)} → ${extractFirstText(form.pairAfter)}`,
      );
    } else {
      headerLines.push(
        `- 유형: ${form.applyType === 'meal' ? 'SIG/PIG 회식비' : 'SIG/PIG 지원금'}`,
      );
      headerLines.push(`- 대상 유형: ${form.orgCategory?.toUpperCase?.() ?? ''}`);
      headerLines.push(`- 대상: ${extractFirstText(form.target)}`);
      headerLines.push(
        `- 학기: ${showPrevTerm && prevTermLabel ? `이전학기(${prevTermLabel})` : '이번학기'}`,
      );
    }

    if (form.applyType === 'fund' || form.applyType === 'meal') {
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

    const reason = normalizeLF(String(form.reasonText ?? '')).trim();
    const ids = (Array.isArray(form.imageIds) ? form.imageIds : [])
      .map((id) => String(id))
      .filter(Boolean);

    const imgs = ids.map((id) => `![image](/api/image/download/${encodeURIComponent(id)})`);

    const blocks = [];
    blocks.push(`${headerLines.join('\n')}\n\n---\n`);
    blocks.push(`## 지원 사유/기타\n\n${reason}\n`);
    if (imgs.length > 0) blocks.push(`\n## 첨부 이미지\n\n${imgs.join('\n')}\n`);

    return { title, content: blocks.join('\n').trim(), attachments: ids };
  };

  const uploadImages = async (files) => {
    const arr = Array.isArray(files)
      ? files.filter(Boolean)
      : Array.from(files || []).filter(Boolean);
    if (arr.length === 0) return;
    if (imageUploading) return;

    const ids = [];

    setImageUploading(true);
    try {
      for (const f of arr) {
        const formData = new FormData();
        formData.append('file', f);

        let res;
        try {
          res = await fetch('/api/file/image/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });
        } catch {
          alert('이미지 업로드 중 네트워크 오류가 발생했습니다.');
          continue;
        }

        let data = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (!res.ok) {
          if (res.status === 401) {
            alert('로그인이 필요합니다. 다시 로그인한 후 이미지를 업로드해 주세요.');
          } else if (res.status === 413 || res.status === 403) {
            alert('이미지 용량이 너무 큽니다. (10MB 이하로 줄인 뒤 다시 시도해 주세요.)');
          } else {
            const msg =
              data?.detail || data?.message || `이미지 업로드 실패 (status ${res.status})`;
            alert(msg);
          }
          continue;
        }

        if (!data?.id) {
          alert('이미지 업로드 응답에 id가 없습니다.');
          continue;
        }

        ids.push(String(data.id));
      }
    } finally {
      setImageUploading(false);
    }

    if (ids.length > 0) {
      const next = Array.from(new Set([...imageIds, ...ids]));
      setImageIds(next);
      setValue('imageIds', next, { shouldValidate: true, shouldDirty: true });
    }
  };

  const removeImageId = (id) => {
    const next = imageIds.filter((x) => x !== id);
    setImageIds(next);
    setValue('imageIds', next, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (form) => {
    try {
      setSubmitting(true);

      const boardIdRaw = boardInfo?.id;
      const boardId =
        typeof boardIdRaw === 'number'
          ? boardIdRaw
          : Number.isFinite(Number(boardIdRaw))
            ? Number(boardIdRaw)
            : null;

      if (!boardId) throw new Error('게시판 정보가 올바르지 않습니다.');

      const reason = String(form.reasonText ?? '').trim();
      if (!reason) throw new Error('지원 사유/기타를 입력해주세요.');
      if (!Array.isArray(form.imageIds) || form.imageIds.length === 0)
        throw new Error('이미지를 1장 이상 첨부해주세요.');

      const payload = buildPayload(form);

      const res = await fetch('/api/article/create', {
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
        throw new Error(text || `신청 실패 (${res.status})`);
      }

      router.replace('/us/contact');
    } catch (e) {
      alert(e?.message ? String(e.message) : '신청 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (initLoading) {
    return (
      <div className="CreateSigContainer">
        <div className="CreateSigCard">
          <p className="CreateSigSubtitle">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="CreateSigContainer">
        <div className="CreateSigCard">
          <p className="C_ErrorText">{initError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="CreateSigContainer">
      <div className="CreateSigHeader">
        <h1 className="CreateSigTitle">지원금 신청</h1>
        <p className="CreateSigSubtitle">SIG/PIG 지원금 또는 대회/짝후 지원을 신청합니다.</p>
      </div>

      <div className="CreateSigCard">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div className="Step fade-in space-y-4">
            <div>
              <label className="C_Label">신청 유형</label>
              <select
                {...register('applyType', { required: true })}
                className={`C_Input ${submitting ? 'is-disabled' : ''}`}
                disabled={submitting}
                defaultValue=""
              >
                <option value="">선택</option>
                <option value="fund">SIG/PIG 지원금</option>
                <option value="meal">SIG/PIG 회식비</option>
                <option value="contest">대회 참가 지원</option>
                <option value="pair">짝후 지원</option>
              </select>
            </div>
          </div>

          {step2Ready && (
            <div className="Step fade-in space-y-4">
              {applyType === 'contest' || applyType === 'pair' ? (
                applyType === 'contest' ? (
                  <div>
                    <label className="C_Label">대회명</label>
                    <input
                      {...register('contestName', { required: true })}
                      placeholder="대회명"
                      className="C_Input"
                      disabled={submitting}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="C_Label">짝선 이름</label>
                      <input
                        {...register('pairBefore', { required: true })}
                        placeholder="짝선 이름"
                        className="C_Input"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="C_Label">짝후 이름</label>
                      <input
                        {...register('pairAfter', { required: true })}
                        placeholder="짝후 이름"
                        className="C_Input"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="C_Label">대상 유형</label>
                    <div className="SigPigControlRow">
                      <select
                        {...register('orgCategory', { required: true })}
                        className={`C_Input ${disableOrgSelects ? 'is-disabled' : ''}`}
                        disabled={disableOrgSelects}
                        defaultValue=""
                      >
                        <option value="">SIG/PIG 선택</option>
                        <option value="sig">SIG</option>
                        <option value="pig">PIG</option>
                      </select>

                      {(applyType === 'fund' || applyType === 'meal') && (
                        <label className="PrevTermInlineCheck">
                          <input
                            type="checkbox"
                            className="C_Checkbox"
                            checked={showPrevTerm}
                            onChange={(e) => {
                              const next = e.target.checked;
                              setShowPrevTerm(next);
                              setValue('target', '', {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                            disabled={disableOrgSelects || !prevTerm}
                          />
                          <span>이전학기{prevTermLabel ? ` (${prevTermLabel})` : ''}</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="C_Label">대상 선택</label>
                    <select
                      {...register('target', { required: true })}
                      className={`C_Input ${disableOrgSelects ? 'is-disabled' : ''}`}
                      disabled={disableOrgSelects}
                      defaultValue=""
                    >
                      <option value="">대상 선택</option>
                      {targetList.length === 0 ? (
                        <option disabled>목록이 없습니다</option>
                      ) : (
                        targetList.map((item, idx) => (
                          <option
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
            <div className="Step fade-in space-y-8">
              {(applyType === 'fund' || applyType === 'meal') && (
                <div className="PayoutSection">
                  <div className="PayoutHeader">
                    <label className="C_Label">신청 금액</label>
                  </div>

                  <div className="PayoutField max-w-md">
                    <input
                      id="fund-amount-input"
                      type="number"
                      {...register('amount', { required: '신청 금액을 입력해주세요.' })}
                      placeholder="신청 금액 (숫자만)"
                      className="C_Input"
                      disabled={submitting}
                    />
                    {errors.amount?.message && (
                      <p className="C_ErrorText" style={{ marginTop: '0.5rem' }}>
                        {String(errors.amount.message)}
                      </p>
                    )}
                  </div>

                  <div className="PayoutKakaoToggle">
                    <label className="C_CheckRow">
                      <input
                        type="checkbox"
                        className="C_Checkbox"
                        {...register('useKakaoPay')}
                        disabled={submitting}
                      />
                      <span className="C_CheckText">카카오페이로 받기</span>
                    </label>
                  </div>

                  {!useKakaoPay && (
                    <div className="PayoutGrid">
                      <div className="PayoutField">
                        <label className="C_SubLabel" htmlFor="fund-bank-input">
                          은행
                        </label>
                        <input
                          id="fund-bank-input"
                          type="text"
                          {...register('bankName')}
                          placeholder="은행 (예: 토스뱅크)"
                          className="C_Input"
                          disabled={useKakaoPay || submitting}
                        />
                      </div>

                      <div className="PayoutField">
                        <label className="C_SubLabel" htmlFor="fund-account-input">
                          계좌번호
                        </label>
                        <input
                          id="fund-account-input"
                          type="text"
                          {...register('accountNumber', {
                            pattern: {
                              value: /^[0-9-]+$/,
                              message: '계좌번호는 숫자와 -만 입력 가능합니다.',
                            },
                          })}
                          placeholder="계좌번호"
                          className="C_Input"
                          disabled={useKakaoPay || submitting}
                        />
                        {errors.accountNumber?.message && (
                          <p className="C_ErrorText" style={{ marginTop: '0.5rem' }}>
                            {String(errors.accountNumber.message)}
                          </p>
                        )}
                      </div>

                      <div className="PayoutField">
                        <label className="C_SubLabel" htmlFor="fund-holder-input">
                          예금주
                        </label>
                        <input
                          id="fund-holder-input"
                          type="text"
                          {...register('accountHolder')}
                          placeholder="예금주"
                          className="C_Input"
                          disabled={useKakaoPay || submitting}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="EditorSection">
                <div className="EditorHeader">
                  <label className="C_Label">상세 내용</label>
                </div>

                <div className="EditorWrapper has-content">
                  <div className="EditorMinHeight">
                    <div className="EditorPlaceholderText">
                      {(PLACEHOLDER[applyType] ?? '').trim()}
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <label className="C_Label">이미지 첨부</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="C_Input"
                        disabled={submitting || imageUploading}
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
                            Array.isArray(v) && v.length > 0
                              ? true
                              : '이미지를 1장 이상 첨부해주세요.',
                        })}
                      />

                      {errors.imageIds?.message && (
                        <p className="C_ErrorText" style={{ marginTop: '0.25rem' }}>
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
                                className="C_Link"
                                href={`/api/image/download/${encodeURIComponent(id)}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {id}
                              </a>
                              <button
                                type="button"
                                className="C_Link"
                                onClick={() => removeImageId(id)}
                                disabled={submitting || imageUploading}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  padding: 0,
                                  cursor: 'pointer',
                                }}
                              >
                                삭제
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <label className="C_Label">지원 사유/기타</label>
                      <textarea
                        {...register('reasonText', {
                          required: '지원 사유/기타를 입력해주세요.',
                          validate: (v) =>
                            String(v ?? '').trim().length > 0 ||
                            '지원 사유/기타를 입력해주세요.',
                        })}
                        placeholder="지원 사유/기타"
                        className="C_Input"
                        disabled={submitting}
                        rows={8}
                        style={{ resize: 'vertical' }}
                      />
                      {errors.reasonText?.message && (
                        <p className="C_ErrorText" style={{ marginTop: '0.25rem' }}>
                          {String(errors.reasonText.message)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <label className="C_CheckRow" style={{ marginTop: '1rem' }}>
                  <input
                    type="checkbox"
                    className="C_Checkbox"
                    {...register('checked', { required: true })}
                    disabled={submitting}
                  />
                  <span className="C_CheckText">
                    <a className="C_Link" href={GUIDE_URL} target="_blank" rel="noreferrer">
                      SCSC 지원 가이드라인
                    </a>
                    을 확인했습니다.
                  </span>
                </label>
              </div>

              <div className="SubmitRow">
                <button
                  type="submit"
                  className="SigCreateBtn"
                  disabled={!isChecked || submitting || imageUploading}
                >
                  {submitting
                    ? '신청 중...'
                    : imageUploading
                      ? '이미지 업로드 중...'
                      : '신청하기'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
