import './page.css';
import BoardClient from '@/components/board/BoardClient';
import { fetchBackendServer, fetchBackendServerJson } from '@/util/fetch/server';

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const board = await fetchBackendServerJson('GET', `/api/board/${id}`);
    const name = (board?.name || '').trim();
    return { title: name || '게시판' };
  } catch {
    return { title: '게시판' };
  }
}

export default async function BoardPage({ params }) {
  const { id } = await params;
  const boardId = id;

  const boardRes = await fetchBackendServer('GET', `/api/board/${boardId}`);

  if (!boardRes.ok) {
    return (
      <div className="text-center text-red-600 mt-10">게시판 정보를 불러올 수 없습니다.</div>
    );
  }

  const board = await boardRes.json();

  return (
    <div id="SigListContainer">
      <div className="SigHeader">
        <div>
          <h1 className="text-3xl font-bold">{board.name}</h1>
          <p className="board-desc">{board.description}</p>
        </div>
      </div>
      <BoardClient board={board} />
    </div>
  );
}
