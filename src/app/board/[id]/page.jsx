import './page.css';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';
import BoardClient from '@/components/board/BoardClient';

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/board/${params.id}`, {
      headers: { 'x-api-secret': getApiSecret() },
      cache: 'no-store',
    });
    if (!res.ok) return { title: '게시판' };

    const board = await res.json();
    const name = (board?.name || '').trim();
    return { title: name || '게시판' }; // 루트 layout의 template이 있다면 자동으로 "이름 | SCSC"
  } catch {
    return { title: '게시판' };
  }
}

export default async function BoardPage({ params }) {
  const boardId = params.id;

  const boardRes = await fetch(`${getBaseUrl()}/api/board/${boardId}`, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });

  if (!boardRes.ok) {
    return <div className="text-center text-red-600 mt-10">게시글을 불러올 수 없습니다.</div>;
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
