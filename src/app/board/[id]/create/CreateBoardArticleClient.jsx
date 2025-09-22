'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import '@/app/board/[id]/create/page.css';

const Editor = dynamic(() => import('@/components/board/EditorWrapper'), {
  ssr: false,
});

export default function CreateBoardArticleClient({ boardInfo }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      title: '',
      editor: '',
    },
  });

  const router = useRouter();
  const content = watch('editor');
  const [submitting, setSubmitting] = useState(false);
  const isFormSubmitted = useRef(false);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      alert('로그인이 필요합니다.');
      router.push('/us/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isFormSubmitted.current && isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleRouteChange = (url) => {
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
  }, [isDirty]);

  const onSubmit = async (data) => {
    if (submitting) return;
    const jwt = localStorage.getItem('jwt');
    setSubmitting(true);

    try {
      const res = await fetch(`/api/article/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-jwt': jwt,
        },
        body: JSON.stringify({
          title: data.title,
          content: data.editor,
          board_id: parseInt(boardInfo.id),
        }),
      });

      if (res.status === 201) {
        alert('게시글 작성 완료!');
        router.push(`/board/${boardInfo.id}`);
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

      <div className={`CreateSigCard space-y-4 ${submitting ? 'is-busy' : ''}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            {...register('title', { required: true })}
            placeholder="제목을 입력하세요"
            className="w-full border p-2 rounded"
          />

          <Editor markdown={content} onChange={(value) => setValue('editor', value)} />

          <button type="submit" className="SigCreateBtn" disabled={submitting}>
            {submitting ? '작성 중...' : '작성 완료'}
          </button>
        </form>
      </div>
    </div>
  );
}
