import type { Metadata } from 'next';
type Board = {
  id: number;
  name: string;
  description: string;
  writing_permission_level: number;
  reading_permission_level: number;
  board_type: 'TEXT' | 'NONE' | 'FILE' | 'IMAGE';
  created_at: string;
  updated_at: string;
};
type PageProps = { params: Promise<{ id: string }> };

import styles from './page.module.css';
import BoardClient from './BoardClient';
import { fetchBackendServer, fetchBackendServerJson } from '@/util/fetch/server';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations('Board');
  const { id } = await params;

  try {
    const board = await fetchBackendServerJson<Board>('GET', `/api/board/${id}`);
    const name = (board?.name || '').trim();
    return { title: name || t('title') };
  } catch {
    return { title: t('title') };
  }
}

export default async function BoardPage({ params }: PageProps) {
  const t = await getTranslations('Board');
  const { id } = await params;
  const boardId = id;

  const boardRes = await fetchBackendServer('GET', `/api/board/${boardId}`);

  if (!boardRes.ok) {
    return <div>{t('loadFailed')}</div>;
  }

  const board: Board = await boardRes.json();

  return (
    <div className={styles.ListContainer}>
      <div className={styles.Header}>
        <div>
          <h1>{board.name}</h1>
          <p>{board.description}</p>
        </div>
      </div>
      <BoardClient board={board} />
    </div>
  );
}
