'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';
import '@/app/board/[id]/create/page.css';

const Editor = dynamic(() => import('@/components/board/EditorWrapper'), { ssr: false });

export default function EditClient({ articleId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [boardId, setBoardId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const isFormSubmitted = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm({ defaultValues: { title: '', editor: '' } });

  const content = watch('editor');

  useEffect(() => {
    const load = async () => {
      try {
        const [articleRes, userRes] = await Promise.all([
          fetch(`/api/article/${articleId}`),
          fetch(`/api/user/profile`),
        ]);
        if (userRes.status === 401) {
          alert('로그인이 필요합니다.');
          router.push('/us/login');
          return;
        }
        if (!articleRes.ok || !userRes.ok) throw new Error();

        const [article, user] = await Promise.all([articleRes.json(), userRes.json()]);

        if (user.id !== article.author_id) {
          alert('작성자만 수정할 수 있습니다.');
          router.replace(`/article/${articleId}`);
          return;
        }

        setValue('title', article.title || '');
        setValue('editor', article.content || '');
        setBoardId(article.board_id);
      } catch {
        alert('게시글 정보를 불러오지 못했습니다.');
        router.replace(`/article/${articleId}`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router, articleId, setValue]);

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
          router.events?.emit?.('routeChangeError');
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
  }, [isDirty, router]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/article/update/${articleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          content: data.editor,
          board_id: parseInt(boardId ?? 0),
        }),
      });

      if (res.status === 204 || res.ok) {
        isFormSubmitted.current = true;
        alert('수정 완료!');
        router.push(`/article/${articleId}`);
      } else if (res.status === 401) {
        alert('다시 로그인해주세요.');
        router.push('/us/login');
      } else {
        let errText = '수정 실패';
        try {
          const err = await res.json();
          errText = err.detail ?? JSON.stringify(err);
        } catch {}
        throw new Error(errText);
      }
    } catch (e) {
      alert(e.message || '네트워크 오류');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="CreateSigContainer">
      <div className="CreateSigHeader">
        <h1 className="CreateSigTitle">게시글 수정</h1>
      </div>

      <div className="CreateSigCard space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            {...register('title', { required: true })}
            placeholder="제목을 입력하세요"
            className="w-full border p-2 rounded"
          />

          <Editor markdown={content} onChange={(v) => setValue('editor', v)} />

          <button type="submit" className="SigCreateBtn" disabled={submitting}>
            {submitting ? '수정 중...' : '수정 완료'}
          </button>
        </form>
      </div>
    </div>
  );
}
