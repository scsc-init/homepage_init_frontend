// app/board/[id]/create/page.jsx
import CreateBoardArticleClient from './CreateBoardArticleClient';

export default async function CreateBoardPage({ params }) {
  const boardInfo = await fetchBoardInfo(params.id);
  return <CreateBoardArticleClient boardInfo={boardInfo} />;
}

async function fetchBoardInfo(boardId) {
  const res = await fetch(`${process.env.BACKEND_URL || ''}/api/board/${boardId}`, {
    cache: 'no-store',
  });
  if (res.ok) return res.json();
}
