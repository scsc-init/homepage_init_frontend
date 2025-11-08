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
지원이 필요한 사유를 명확히 밝혀야 합니다.
지원금액을 증빙할 수 있는 가격표를 첨부하여야 합니다.`,
  meal: `아래 항목을 참고해 상세 내용을 작성해주세요.

승인 절차: 임원진 검토 후 승인
지원 한도: 회식 참여 인원 당 10,000원
회식을 진행한 SIG 또는 PIG 명을 밝혀야 합니다.
회식을 증빙할 수 있는 사진을 첨부하여야 합니다. 사진에는 모든 회식참여 인원이 보여야 합니다.
지원금액을 증빙할 수 있는 영수증을 첨부하여야 합니다. 부득이하게 영수증을 챙기지 못했을 경우, 신용카드 출금내역으로 갈음할 수 있습니다.
회식 날짜는 사전에 조율했음을 밝힐 수 있는 자료 (카카오톡 메세지 등)을 첨부해야 합니다. 공개된 디스코드 채팅에서 날짜를 조율했을 경우, 생략가능합니다.`,
  pair: `아래 항목을 참고해 상세 내용을 작성해주세요.

짝선짝후 조 내에서 밥약이 이루어질 경우 식사비용을 지원합니다.
지원 한도: 회원 당 누적 10,000원.
 회식을 진행한 인원을 밝혀야 합니다.
 회식을 증빙할 수 있는 사진을 첨부하여야 합니다. 사진에는 모든 회식참여 인원이 보여야 합니다.
 지원금액을 증빙할 수 있는 영수증을 첨부하여야 합니다. 부득이하게 영수증을 챙기지 못했을 경우, 신용카드 출금내역으로 갈음할 수 있습니다.`,
};

export default function FundApplyClient({ boardInfo, sigs, pigs }) {
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

  const [user, setUser] = useState(null);
  const [targetList, setTargetList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const isFormSubmitted = useRef(false);

  const placeholderRef = useRef(null);
  const wrapperRef = useRef(null);

  const step1Done = !!applyType;
  const step2Done =
    applyType === 'contest'
      ? contestName.trim().length > 0
      : applyType === 'pair'
        ? pairBefore.trim().length > 0 && pairAfter.trim().length > 0
        : orgCategory && !!watch('target');
  const step3Ready = step1Done && step2Done;

  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => {
        if (res.status === 401) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => router.push('/us/login'));
  }, [router]);

  useEffect(() => {
    if (orgCategory === 'sig') setTargetList(Array.isArray(sigs) ? sigs : []);
    else if (orgCategory === 'pig') setTargetList(Array.isArray(pigs) ? pigs : []);
    else setTargetList([]);
  }, [orgCategory, sigs, pigs]);

  useEffect(() => {
    if (applyType === 'contest' || applyType === 'pair') {
      setValue('orgCategory', '');
      setValue('target', '');
    } else {
      setValue('contestName', '');
      setValue('pairBefore', '');
      setValue('pairAfter', '');
    }
  }, [applyType, setValue]);

  const typeLabel = (t) =>
    t === 'contest'
      ? '대회 참여 지원금'
      : t === 'fund'
        ? 'SIG/PIG 지원금'
        : t === 'meal'
          ? 'SIG/PIG 회식비'
          : t === 'pair'
            ? '짝선짝후 지원금'
            : '';

  const normalizeLF = (s) => (s ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const fmtNumber = (n) => new Intl.NumberFormat('ko-KR').format(Number(n || 0));
  const sanitizeAccountNumber = (value) => String(value ?? '').replace(/\D/g, '');

  const onSubmit = async (data) => {
    if (submitting) return;
    if (!user) return;

    const bankName = String(data.bankName || '').trim();
    const accountNumberInput = String(data.accountNumber || '').trim();
    const accountHolder = String(data.accountHolder || '').trim();
    const isKakaoPay = Boolean(data.useKakaoPay);
    const amountNumber = Number(data.amount || 0);
    const sanitizedAccountNumber = sanitizeAccountNumber(accountNumberInput);

    if (!isKakaoPay) {
      if (!bankName) {
        alert('은행명을 입력해주세요.');
        return;
      }
      if (!sanitizedAccountNumber) {
        alert('계좌번호를 입력해주세요.');
        return;
      }
      if (!accountHolder) {
        alert('예금주를 입력해주세요.');
        return;
      }
    }

    setSubmitting(true);

    const tLabel = typeLabel(data.applyType);
    const targetDisplay =
      data.applyType === 'contest'
        ? data.contestName
        : data.applyType === 'pair'
          ? `${data.pairBefore} / ${data.pairAfter}`
          : `${data.orgCategory?.toUpperCase()} - ${data.target}`;
    const payoutInfo = isKakaoPay
      ? '카카오페이로 받겠습니다'
      : `${bankName} | ${sanitizedAccountNumber} | ${accountHolder}`;

    const metaLines = [
      `**신청 유형**: ${tLabel}`,
      `**대상**: ${targetDisplay}`,
      `**신청 금액**: ${fmtNumber(amountNumber)}원`,
      `**지급 정보**: ${payoutInfo}`,
      `**신청자**: ${user.student_id} ${user.name} (${user.email})`,
    ];
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
          board_id: parseInt(boardInfo.id),
        }),
      });

      if (res.status === 201) {
        isFormSubmitted.current = true;
        alert('신청이 접수되었습니다.');
        router.push('/us/contact');
        return;
      }

      const err = await res.json().catch(() => ({}));
      const msg =
        err && (err.detail || err.message)
          ? String(err.detail || err.message)
          : `HTTP ${res.status}`;
      alert(`신청 실패: ${msg}`);
    } catch (e) {
      alert(`네트워크 오류: ${e?.message || e}`);
    } finally {
      setSubmitting(false);
    }
  };

  const placeholderText =
    applyType === 'contest'
      ? PLACEHOLDER.contest
      : applyType === 'fund'
        ? PLACEHOLDER.fund
        : applyType === 'meal'
          ? PLACEHOLDER.meal
          : applyType === 'pair'
            ? PLACEHOLDER.pair
            : '';
  const hasContent = (content || '').replace(/\s|#/g, '').length > 0;

  const updateMinHeight = () => {
    if (!wrapperRef.current || !placeholderRef.current) return;
    const el = placeholderRef.current;
    const top = el.offsetTop || 0;
    const ph = el.scrollHeight || 0;
    const bottomPad = 16;
    const desired = Math.max(192, top + ph + bottomPad);
    wrapperRef.current.style.setProperty('--editor-min-height', `${desired}px`);
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

  if (!boardInfo?.id) return null;

  const disableOrgSelects = applyType === 'contest' || applyType === 'pair';

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
                      {targetList.length === 0 ? (
                        <option disabled>목록이 없습니다</option>
                      ) : (
                        targetList.map((item) => (
                          <option
                            key={item.id ?? item.title}
                            value={item.title ?? item.name ?? item.label}
                          >
                            {item.title ?? item.name ?? item.label}
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
              <div className="PayoutSection space-y-6">
                <div className="PayoutHeader">
                  <label className="C_Label">신청 금액 및 지급 방식</label>
                  <p className="PayoutHelpText">
                    카카오페이를 선택하지 않으면 아래 계좌 정보를 모두 입력해주세요.
                  </p>
                </div>
                <label className="C_CheckRow PayoutCheck">
                  <input
                    type="checkbox"
                    {...register('useKakaoPay')}
                    className="C_Checkbox"
                    disabled={submitting}
                  />
                  <span className="C_CheckText">카카오페이로 받겠습니다</span>
                </label>
                <div className="PayoutGrid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  <div className="PayoutField">
                    <label className="C_SubLabel" htmlFor="fund-amount-input">
                      신청 금액
                    </label>
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
                        {errors.amount.message}
                      </p>
                    )}
                  </div>
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
                      inputMode="numeric"
                      autoComplete="off"
                      {...register('accountNumber', {
                        validate: (value) => {
                          if (useKakaoPay) return true;
                          const cleaned = sanitizeAccountNumber(value);
                          if (!cleaned) return '계좌번호를 입력해주세요.';
                          return /^\d+$/.test(cleaned) || '계좌번호는 숫자만 입력해주세요.';
                        },
                      })}
                      placeholder="계좌번호 (숫자·하이픈 붙여넣기 가능)"
                      className="C_Input"
                      disabled={useKakaoPay || submitting}
                    />
                    {!useKakaoPay && errors.accountNumber?.message && (
                      <p className="C_ErrorText" style={{ marginTop: '0.5rem' }}>
                        {errors.accountNumber.message}
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
                      placeholder="예금주 (예: 홍길동)"
                      className="C_Input"
                      disabled={useKakaoPay || submitting}
                    />
                  </div>
                </div>
              </div>

              <div className="DetailSection space-y-3">
                <label className="C_Label" htmlFor="fund-detail-editor">
                  상세 내용
                </label>
                <div
                  id="fund-detail-editor"
                  ref={wrapperRef}
                  className={`EditorWrapper ${hasContent ? 'has-content' : ''}`}
                >
                  {!hasContent && (
                    <div ref={placeholderRef} className="EditorPlaceholder">
                      <div className="EditorPlaceholderText">{placeholderText}</div>
                    </div>
                  )}
                  <Editor markdown={content} onChange={(v) => setValue('editor', v)} />
                </div>
              </div>
            </div>
          )}

          {step3Ready && (
            <div className="Step fade-in space-y-3">
              <label className="C_CheckRow">
                <input
                  type="checkbox"
                  {...register('checked', { required: true })}
                  className="C_Checkbox"
                />
                <span className="C_CheckText">
                  <a
                    href={GUIDE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="C_Link"
                  >
                    SCSC 지원 가이드라인
                  </a>
                  을 확인했습니다.
                </span>
              </label>

              <button
                type="submit"
                className="SigCreateBtn"
                disabled={submitting || !isChecked}
              >
                {submitting ? '신청 중...' : '신청하기'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
