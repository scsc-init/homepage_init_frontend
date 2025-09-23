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
};

export default function FundApplyClient({ boardInfo, sigs, pigs }) {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      applyType: '',
      orgCategory: '',
      target: '',
      contestName: '',
      amount: '',
      editor: '',
      checked: false,
    },
  });

  const router = useRouter();
  const content = watch('editor');
  const applyType = watch('applyType');
  const orgCategory = watch('orgCategory');
  const contestName = watch('contestName');
  const isChecked = watch('checked');

  const [user, setUser] = useState(null);
  const [targetList, setTargetList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const isFormSubmitted = useRef(false);

  const placeholderRef = useRef(null);
  const wrapperRef = useRef(null);

  const step1Done = !!applyType;
  const step2Done =
    applyType === 'contest' ? contestName.trim().length > 0 : orgCategory && !!watch('target');
  const step3Ready = step1Done && step2Done;

  useEffect(() => {
    fetch("/api/user/profile")
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
    if (applyType === 'contest') {
      setValue('orgCategory', '');
      setValue('target', '');
    } else {
      setValue('contestName', '');
    }
  }, [applyType, setValue]);

  const typeLabel = (t) =>
    t === 'contest' ? '대회 참여 지원금' : t === 'fund' ? 'SIG/PIG 지원금' : 'SIG/PIG 회식비';

  const normalizeLF = (s) => (s ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const fmtNumber = (n) => new Intl.NumberFormat('ko-KR').format(Number(n || 0));

  const onSubmit = async (data) => {
    if (submitting) return;
    if (!user) return;

    setSubmitting(true);

    const tLabel = typeLabel(data.applyType);
    const targetDisplay =
      data.applyType === 'contest'
        ? data.contestName
        : `${data.orgCategory?.toUpperCase()} - ${data.target}`;

    const metaLines = [
      `**신청 유형**: ${tLabel}`,
      `**대상**: ${targetDisplay}`,
      `**신청 금액**: ${fmtNumber(data.amount)}원`,
      `**신청자**: ${user.student_id} ${user.name} (${user.email})`,
    ];
    const metaBlock = metaLines.join('  \n');

    const body = normalizeLF(data.editor).trim();
    const summary = `${metaBlock}\n\n---\n\n### 상세 내용\n\n${body}`;

    try {
      const res = await fetch("/api/article/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const disableOrgSelects = applyType === 'contest';

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
            <div className="Step fade-in space-y-4">
              <div>
                <label className="C_Label">신청 금액</label>
                <input
                  type="number"
                  {...register('amount', { required: true, min: 1 })}
                  placeholder="신청 금액 (숫자만)"
                  className="C_Input"
                />
              </div>

              <div
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
