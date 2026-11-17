'use client';

type Board = {
  id: number;
  name: string;
  description: string;
  board_type: 'TEXT' | 'NONE' | 'FILE' | 'IMAGE';
};
type ArticleSubmission = { title: string; editor: string; attachments: string[] };

import { fetchBackendClient } from '@/util/fetch/client';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { pushLoginWithRedirect } from '@/util/loginRedirect';
import WriteEditorStandard from './WriteEditorStandard';
import WriteEditorAlbum from './WriteEditorAlbum';
import WriteEditorFile from './WriteEditorFile';
import { useMe } from '@/util/hooks/useMe';
import { useTranslations } from 'next-intl';

export default function CreateBoardArticleClient({
  boardInfo,
  boardType,
}: {
  boardInfo: Board;
  boardType: 'image' | 'file' | 'text';
}) {
  const t = useTranslations('BoardCreate');
  const router = useRouter();
  const { me, isLoading, isUnauthenticated } = useMe();
  const [submitting, setSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const isFormSubmitted = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (isUnauthenticated || !me) {
      alert(t('loginRequired'));
      pushLoginWithRedirect(router);
    }
  }, [isLoading, isUnauthenticated, me, router, t]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFormSubmitted.current && isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const onSubmit = async (data: ArticleSubmission) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetchBackendClient(`/api/article/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          content: data.editor,
          board_id: boardInfo.id,
          attachments: Array.isArray(data.attachments) ? data.attachments : [],
        }),
      });

      if (res.status === 201) {
        alert(t('success'));
        router.push(`/board/${boardInfo.id}`);
      } else if (res.status === 401) {
        alert(t('loginAgain'));
        pushLoginWithRedirect(router);
      } else {
        const err = await res.json();
        throw new Error(t('failed', { error: err.detail ?? JSON.stringify(err) }));
      }
    } catch (err) {
      alert((err as { message?: string }).message || t('networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.CreateContainer}>
      <div className={styles.CreateHeader}>
        <h1 className={styles.CreateTitle}>
          {boardInfo ? t('title', { name: boardInfo.name }) : t('genericTitle')}
        </h1>
        <p className={styles.CreateSubtitle}>{boardInfo?.description ?? t('loadingBoard')}</p>
      </div>

      {boardType === 'image' ? (
        <WriteEditorAlbum
          boardInfo={boardInfo}
          onSubmit={onSubmit}
          submitting={submitting}
          onDirtyChange={setIsDirty}
        />
      ) : boardType === 'file' ? (
        <WriteEditorFile
          boardInfo={boardInfo}
          onSubmit={onSubmit}
          submitting={submitting}
          onDirtyChange={setIsDirty}
        />
      ) : (
        <WriteEditorStandard
          boardInfo={boardInfo}
          onSubmit={onSubmit}
          submitting={submitting}
          onDirtyChange={setIsDirty}
        />
      )}
    </div>
  );
}
