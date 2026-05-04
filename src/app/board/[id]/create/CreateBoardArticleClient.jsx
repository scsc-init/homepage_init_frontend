'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/board/[id]/create/page.css';
import { pushLoginWithRedirect } from '@/util/loginRedirect';
import WriteEditorStandard from '@/components/board/WriteEditorStandard';
import WriteEditorAlbum from '@/components/board/WriteEditorAlbum';

export default function CreateBoardArticleClient({ boardInfo, boardType }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const isFormSubmitted = useRef(false);
  const isDirty = false;

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`/api/user/profile`, { cache: 'no-store' });
        if (res.status === 401) {
          alert('로그인이 필요합니다.');
          pushLoginWithRedirect(router);
        }
      } catch {
        pushLoginWithRedirect(router);
      }
    };
    check();
  }, [router]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isFormSubmitted.current && isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleRouteChange = () => {
      if (!isFormSubmitted.current && isDirty) {
        const confirmed = confirm('작성 중인 내용이 있습니다. 페이지를 떠나시겠습니까?');
        if (!confirmed) {
          router.events.emit('routeChangeError');
          throw 'Route change aborted by user.';
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    router.events?.on?.('routeChangeStart', handleRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.events?.off?.('routeChangeStart', handleRouteChange);
    };
  }, [router, isDirty]);

  const onSubmit = async (data) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/article/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          content: data.editor,
          board_id: parseInt(boardInfo.id),
          attachments: Array.isArray(data.attachments) ? data.attachments : [],
        }),
      });

      if (res.status === 201) {
        alert('게시글 작성 완료!');
        router.push(`/board/${boardInfo.id}`);
      } else if (res.status === 401) {
        alert('다시 로그인해주세요.');
        pushLoginWithRedirect(router);
      } else {
        const err = await res.json();
        throw new Error('작성 실패: ' + (err.detail ?? JSON.stringify(err)));
      }
    } catch (err) {
      alert(err.message || '네트워크 오류');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="CreateSigContainer">
      <div className="CreateSigHeader">
        <h1 className="CreateSigTitle">
          {boardInfo ? `${boardInfo.name}에 게시글 작성` : '게시글 작성'}
        </h1>
        <p className="CreateSigSubtitle">
          {boardInfo?.description ?? '게시판 정보를 불러오는 중...'}
        </p>
      </div>

      {boardType === 'image' ? (
        <WriteEditorAlbum boardInfo={boardInfo} onSubmit={onSubmit} submitting={submitting} />
      ) : (
        <WriteEditorStandard
          boardInfo={boardInfo}
          onSubmit={onSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
}
