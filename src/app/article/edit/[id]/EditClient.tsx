'use client';

type Article = {
  title: string;
  author_id: string;
  board_id: number;
  content: string | null;
  attachments: unknown[];
};
type ArticleFormValues = { title: string; editor: string };

import { fetchBackendClient } from '@/util/fetch/client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from '@/app/board/[id]/create/page.module.css';
import AttachmentUploader from '@/components/form-control/AttachmentUploader';
import { pushLoginWithRedirect } from '@/util/loginRedirect';
import { useMe } from '@/util/hooks/useMe';

// Preserve the existing optional event calls during the TypeScript migration.
// App Router does not supply these events; this type does not add them at runtime.
type RouterWithOptionalEvents = ReturnType<typeof useRouter> & {
  events?: {
    emit?: (event: 'routeChangeError') => void;
    on?: (event: 'routeChangeStart', handler: () => void) => void;
    off?: (event: 'routeChangeStart', handler: () => void) => void;
  };
};

const Editor = dynamic(() => import('@/components/form-control/EditorWrapper'), { ssr: false });

export default function EditClient({ articleId }: { articleId: string }) {
  const router = useRouter() as RouterWithOptionalEvents;
  const { me: user, isLoading: isMeLoading, isUnauthenticated } = useMe();
  const [loading, setLoading] = useState(true);
  const [boardId, setBoardId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [attachmentIds, setAttachmentIds] = useState<string[]>([]);
  const isFormSubmitted = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<ArticleFormValues>({ defaultValues: { title: '', editor: '' } });

  const content = watch('editor');

  useEffect(() => {
    if (isMeLoading) return;
    if (isUnauthenticated || !user) {
      alert('로그인이 필요합니다.');
      pushLoginWithRedirect(router);
      return;
    }

    const load = async () => {
      try {
        const articleRes = await fetchBackendClient(`/api/article/${articleId}`);
        if (!articleRes.ok) throw new Error();
        const article: Article = await articleRes.json();

        if (user.id !== article.author_id) {
          alert('작성자만 수정할 수 있습니다.');
          router.replace(`/article/${articleId}`);
          return;
        }

        setValue('title', article.title || '');
        setValue('editor', article.content || '');
        setBoardId(article.board_id);

        const rawAttachments = Array.isArray(article.attachments) ? article.attachments : [];
        const sanitizedIds = rawAttachments.map((item) => {
          if (typeof item === 'object' && item !== null) {
            return String(item.file_id || item.id || '');
          }
          return String(item);
        });
        setAttachmentIds(sanitizedIds);
      } catch {
        alert('게시글 정보를 불러오지 못했습니다.');
        router.replace(`/article/${articleId}`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router, articleId, setValue, user, isMeLoading, isUnauthenticated]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
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

  const onSubmit = async (data: ArticleFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetchBackendClient(`/api/article/update/${articleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          content: data.editor,
          board_id: parseInt(String(boardId ?? 0)),
          attachments: Array.isArray(attachmentIds) ? attachmentIds : [],
        }),
      });

      if (res.status === 204 || res.ok) {
        isFormSubmitted.current = true;
        alert('수정 완료!');
        router.push(`/article/${articleId}`);
      } else if (res.status === 401) {
        alert('다시 로그인해 주세요.');
        pushLoginWithRedirect(router);
      } else {
        let errText = '수정 실패';
        try {
          const err = await res.json();
          errText = err.detail || JSON.stringify(err);
        } catch {}
        throw new Error(errText);
      }
    } catch (e) {
      alert((e as { message?: string }).message || '네트워크 오류');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.CreateContainer}>
      <div className={styles.CreateHeader}>
        <h1 className={styles.CreateTitle}>게시글 수정</h1>
      </div>

      <div className={styles.CreateCard}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            {...register('title', { required: true })}
            placeholder="제목을 입력하세요"
            className={styles.Input}
          />

          <Editor
            className={styles.Editor}
            markdown={content}
            onChange={(v) => setValue('editor', v)}
          />

          <AttachmentUploader
            valueIds={attachmentIds}
            onChangeIds={setAttachmentIds}
            isFileUpload
          />
          <button type="submit" className={styles.CreateBtn} disabled={submitting}>
            {submitting ? '수정 중...' : '수정 완료'}
          </button>
        </form>
      </div>
    </div>
  );
}
