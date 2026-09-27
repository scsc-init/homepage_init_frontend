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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const board = await fetchBackendServerJson<Board>('GET', `/api/board/${id}`);
    const name = (board?.name || '').trim();
    return { title: name || '게시판' };
  } catch {
    return { title: '게시판' };
  }
}

export default async function BoardPage({ params }: PageProps) {
  const { id } = await params;
  const boardId = id;

  const boardRes = await fetchBackendServer('GET', `/api/board/${boardId}`);

  if (!boardRes.ok) {
    return <div>게시판 정보를 불러올 수 없습니다.</div>;
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
