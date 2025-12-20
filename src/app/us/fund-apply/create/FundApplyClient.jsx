'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import './page.css';

const Editor = dynamic(() => import('@/components/board/EditorWrapper'), {
  ssr: false,
});

const GUIDE_URL =
  'https://github.com/scsc-init/homepage_init/blob/master/%EC%9A%B4%EC%98%81%EC%A7%84_%EC%9E%90%EB%A3%8C/%EC%A7%80%EC%9B%90%EA%B8%88_%EC%8B%A0%EC%B2%AD_%EC%95%88%EB%82%B4%EC%82%AC%ED%95%AD.md';

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

function stripSpaces(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/\s+/g, ' ').trim();
}

export default function FundApplyClient({ boardInfo, sigs, pigs, globalStatus }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
      editor: '',
      checked: false,
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      useKakaoPay: false,
    },
  });

  const router = useRouter();
  const content = watch('editor');
  const applyType = watch('applyType');
  const orgCategory = watch('orgCategory');
  const contestName = watch('contestName');
  const pairBefore = watch('pairBefore');
  const pairAfter = watch('pairAfter');
  const isChecked = watch('checked');
  const useKakaoPay = watch('useKakaoPay');

  const semesterLabel = (sem) => {
    const s = Number(sem);
    if (s === 1) return '1학기';
    if (s === 2) return '여름학기';
    if (s === 3) return '2학기';
    if (s === 4) return '겨울학기';
    return '';
  };

  const getPrevTerm = (year, semester) => {
    const y = Number(year);
    const s = Number(semester);
    if (!Number.isFinite(y) || !Number.isFinite(s)) return null;
    if (s > 1) return { year: y, semester: s - 1 };
    return { year: y - 1, semester: 4 };
  };

  const currentYear = globalStatus?.year != null ? Number(globalStatus.year) : null;
  const currentSemester = globalStatus?.semester != null ? Number(globalStatus.semester) : null;

  const currentTerm =
    Number.isFinite(currentYear) && Number.isFinite(currentSemester)
      ? { year: currentYear, semester: currentSemester }
      : null;

  const prevTerm = currentTerm ? getPrevTerm(currentTerm.year, currentTerm.semester) : null;

  const isSigPigApply = applyType === 'fund' || applyType === 'meal';

  const [user, setUser] = useState(null);
  const [targetList, setTargetList] = useState([]);
  const [showPrevTerm, setShowPrevTerm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isFormSubmitted = useRef(false);

  const placeholderRef = useRef(null);
  const wrapperRef = useRef(null);

  const step1Done = !!applyType;
  const step2Done =
    applyType === 'contest'
      ? !!contestName
      : applyType === 'pair'
        ? !!pairBefore && !!pairAfter
        : !!orgCategory && !!watch('target');
  const step3Ready = step1Done && step2Done;

  const placeholderText = PLACEHOLDER[applyType] ?? '';

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch('/api/user/profile', { cache: 'no-store' });
        if (!res.ok) throw new Error('profile fetch failed');
        const data = await res.json();
        if (alive) setUser(data);
      } catch {
        if (alive) setUser(null);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const list =
      orgCategory === 'sig'
        ? Array.isArray(sigs)
          ? sigs
          : []
        : orgCategory === 'pig'
          ? Array.isArray(pigs)
            ? pigs
            : []
          : [];

    if (!showPrevTerm || !prevTerm) {
      setTargetList(list);
      return;
    }

    const filtered = list.filter(
      (x) =>
        Number(x?.year) === Number(prevTerm.year) &&
        Number(x?.semester) === Number(prevTerm.semester),
    );

    setTargetList(filtered);
  }, [orgCategory, sigs, pigs, showPrevTerm, prevTerm?.year, prevTerm?.semester]);

  useEffect(() => {
    const selected = watch('target');
    if (!selected) return;

    const exists = targetList.some(
      (item) => (item?.title ?? item?.name ?? item?.label) === String(selected),
    );

    if (!exists) setValue('target', '');
  }, [targetList, setValue, watch]);

  useEffect(() => {
    if (applyType === 'contest') {
      setValue('orgCategory', '');
      setValue('target', '');
      setValue('pairBefore', '');
      setValue('pairAfter', '');
    } else if (applyType === 'pair') {
      setValue('orgCategory', '');
      setValue('target', '');
      setValue('contestName', '');
    } else {
      setValue('contestName', '');
      setValue('pairBefore', '');
      setValue('pairAfter', '');
    }
  }, [applyType, setValue]);

  useEffect(() => {
    if (!isSigPigApply) setShowPrevTerm(false);
  }, [isSigPigApply]);

  useEffect(() => {
    if (!(orgCategory === 'sig' || orgCategory === 'pig')) setShowPrevTerm(false);
  }, [orgCategory]);

  const typeLabel = (t) =>
    t === 'contest'
      ? '대회 참여 지원금'
      : t === 'fund'
        ? 'SIG/PIG 지원금'
        : t === 'meal'
          ? 'SIG/PIG 회식비'
          : t === 'pair'
            ? '짝선짝후 지원금'
            : t;

  const getTargetDisplay = (t, cat, trg) => {
    if (t === 'contest') return contestName;
    if (t === 'pair') return `${pairBefore} → ${pairAfter}`;
    if (cat === 'sig') return `SIG: ${trg}`;
    if (cat === 'pig') return `PIG: ${trg}`;
    return trg;
  };

  const submitValidate = (data) => {
    if (!data.applyType) return '신청 유형을 선택해주세요.';
    if (data.applyType === 'contest') {
      if (!stripSpaces(data.contestName)) return '대회명을 입력해주세요.';
    } else if (data.applyType === 'pair') {
      if (!stripSpaces(data.pairBefore) || !stripSpaces(data.pairAfter))
        return '짝선/짝후 이름을 입력해주세요.';
    } else {
      if (!data.orgCategory) return '대상 유형(SIG/PIG)을 선택해주세요.';
      if (!data.target) return '대상을 선택해주세요.';
    }

    if (!stripSpaces(String(data.amount ?? ''))) return '신청 금액을 입력해주세요.';
    if (!Number.isFinite(Number(data.amount)) || Number(data.amount) <= 0)
      return '신청 금액은 0보다 큰 숫자여야 합니다.';

    if (!data.useKakaoPay) {
      if (!stripSpaces(data.bankName)) return '은행명을 입력해주세요.';
      if (!stripSpaces(data.accountNumber)) return '계좌번호를 입력해주세요.';
      if (!stripSpaces(data.accountHolder)) return '예금주를 입력해주세요.';
    }

    if (!data.checked) return '안내사항을 확인해주세요.';
    if (!stripSpaces(data.editor)) return '상세 내용을 작성해주세요.';
    if (!user) return '사용자 정보를 불러오지 못했습니다. 다시 로그인해주세요.';

    return null;
  };

  const onSubmit = async (data) => {
    if (isFormSubmitted.current) return;

    const errorMsg = submitValidate(data);
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    setSubmitting(true);
    isFormSubmitted.current = true;

    const tLabel = typeLabel(data.applyType);
    const targetDisplay = getTargetDisplay(data.applyType, data.orgCategory, data.target);

    const payoutInfo = data.useKakaoPay
      ? '카카오페이 송금'
      : `${data.bankName} / ${data.accountNumber} / ${data.accountHolder}`;

    const metaLines = [
      `**신청 유형**: ${tLabel}`,
      data.applyType === 'contest' ? `**대회명**: ${stripSpaces(data.contestName)}` : null,
      data.applyType === 'pair'
        ? `**짝선/짝후**: ${stripSpaces(data.pairBefore)} → ${stripSpaces(data.pairAfter)}`
        : null,
      data.applyType !== 'contest' && data.applyType !== 'pair'
        ? `**대상**: ${targetDisplay}`
        : null,
      `**신청 금액**: ${Number(data.amount).toLocaleString()}원`,
      `**지급 정보**: ${payoutInfo}`,
      `**신청자**: ${user.student_id} ${user.name} (${user.email})`,
    ].filter(Boolean);

    const metaBlock = metaLines.join('  \n');
    const body = normalizeLF(data.editor).trim();
    const summary = `${metaBlock}\n\n---\n\n### 상세 내용\n\n${body}`;

    try {
      const res = await fetch('/api/article/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `[${tLabel}] ${targetDisplay}`,
          content: summary,
          board_id: parseInt(boardInfo.id, 10),
        }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => '');
        throw new Error(t || 'submit failed');
      }

      router.push('/us/contact');
    } catch (e) {
      console.error(e);
      alert('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      isFormSubmitted.current = false;
      setSubmitting(false);
    }
  };

  const updateMinHeight = () => {
    if (!placeholderRef.current || !wrapperRef.current) return;

    const ph = placeholderRef.current.getBoundingClientRect().height;
    const current = wrapperRef.current.getBoundingClientRect().height;

    const min = Math.max(ph, current);
    wrapperRef.current.style.minHeight = `${min}px`;
  };

  useEffect(() => {
    const id = requestAnimationFrame(updateMinHeight);
    return () => cancelAnimationFrame(id);
  }, [placeholderText, step3Ready, applyType]);

  useEffect(() => {
    if (!placeholderRef.current) return;

    const ro = new ResizeObserver(updateMinHeight);
    ro.observe(placeholderRef.current);

    window.addEventListener('resize', updateMinHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateMinHeight);
    };
  }, []);

  const disableOrgSelects = applyType === 'contest' || applyType === 'pair';

  const canUsePrevToggle =
    isSigPigApply &&
    !disableOrgSelects &&
    (orgCategory === 'sig' || orgCategory === 'pig') &&
    !!prevTerm;

  const showPrevToggleUI = isSigPigApply && !!currentTerm && !!prevTerm;

  return (
    <div className="CreateSigContainer">
      <div className="CreateSigHeader">
        <h1 className="CreateSigTitle">지원금 신청</h1>
        <p className="CreateSigSubtitle">{boardInfo?.description ?? ''}</p>
      </div>

      <div className={`CreateSigCard ${submitting ? 'is-busy' : ''}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="Step fade-in">
            <label className="C_Label">신청 유형</label>
            <select
              {...register('applyType', { required: true })}
              className="C_Input"
              defaultValue=""
            >
              <option value="">신청 유형 선택</option>
              <option value="contest">대회 참여 지원금</option>
              <option value="fund">SIG/PIG 지원금</option>
              <option value="meal">SIG/PIG 회식비</option>
              <option value="pair">짝선짝후 지원금</option>
            </select>
          </div>

          {step1Done && (
            <div className="Step fade-in">
              {applyType === 'contest' ? (
                <div className="grid grid-cols-1 gap-4">
                  <label className="C_Label">대회명</label>
                  <input
                    type="text"
                    {...register('contestName', { required: true })}
                    placeholder="ex) ICPC 본선"
                    className="C_Input"
                  />
                </div>
              ) : applyType === 'pair' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="C_Label">짝선 이름</label>
                    <input
                      type="text"
                      {...register('pairBefore', { required: true })}
                      placeholder="짝선 이름"
                      className="C_Input"
                    />
                  </div>
                  <div>
                    <label className="C_Label">짝후 이름</label>
                    <input
                      type="text"
                      {...register('pairAfter', { required: true })}
                      placeholder="짝후 이름"
                      className="C_Input"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="C_Label">대상 유형</label>
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
                        {targetList.map((t, idx) => {
                          const label = t?.title ?? t?.name ?? t?.label ?? '';
                          return (
                            <option key={`${label}-${idx}`} value={label}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {showPrevToggleUI && (
                    <div className="TermToggleBox">
                      <label
                        className={`C_CheckRow TermToggle ${!canUsePrevToggle ? 'is-disabled' : ''}`}
                      >
                        <input
                          type="checkbox"
                          className="C_Checkbox"
                          checked={showPrevTerm}
                          onChange={(e) => setShowPrevTerm(e.target.checked)}
                          disabled={!canUsePrevToggle}
                        />
                        <span className="C_CheckText">
                          이전학기만 보기
                          <span className="TermToggleMeta">
                            {' '}
                            ({prevTerm.year}년 {semesterLabel(prevTerm.semester)})
                          </span>
                        </span>
                      </label>
                      <p className="TermToggleHelp">
                        현재 학기: {currentTerm.year}년 {semesterLabel(currentTerm.semester)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step3Ready && (
            <div className="Step fade-in space-y-8">
              <div className="PayoutSection">
                <div className="PayoutHeader">
                  <label className="C_Label">신청 금액</label>
                </div>

                <div className="PayoutField max-w-md">
                  <input
                    id="fund-amount-input"
                    type="number"
                    {...register('amount', {
                      required: '신청 금액을 입력해주세요.',
                    })}
                    placeholder="신청 금액 (숫자만)"
                    className="C_Input"
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

              <div className="EditorSection">
                <div className="EditorHeader">
                  <label className="C_Label">상세 내용</label>
                  <a className="GuideLink" href={GUIDE_URL} target="_blank" rel="noreferrer">
                    작성 가이드
                  </a>
                </div>

                <div className="EditorWrapper">
                  <div ref={wrapperRef} className="EditorMinHeight">
                    <Editor
                      value={content}
                      onChange={(v) => setValue('editor', v)}
                      disabled={submitting}
                    />
                  </div>

                  <div ref={placeholderRef} className="EditorPlaceholder" aria-hidden="true">
                    {placeholderText}
                  </div>
                </div>

                <label className="C_CheckRow" style={{ marginTop: '1rem' }}>
                  <input
                    type="checkbox"
                    className="C_Checkbox"
                    {...register('checked', { required: true })}
                  />
                  <span className="C_CheckText">안내사항을 확인했습니다.</span>
                </label>
              </div>

              <div className="SubmitRow">
                <button type="submit" className="C_Button" disabled={!isChecked || submitting}>
                  {submitting ? '신청 중...' : '신청하기'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
