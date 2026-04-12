// app/board/[id]/create/page.jsx
import CreateBoardArticleClient from './CreateBoardArticleClient';

export default async function CreateBoardPage({ params, searchParams }) {
  const boardInfo = await fetchBoardInfo(params.id);
  const boardType = searchParams?.t || 'text';
  return <CreateBoardArticleClient boardInfo={boardInfo} boardType={boardType} />;
}

async function fetchBoardInfo(boardId) {
  const res = await fetch(`${process.env.BACKEND_URL || ''}/api/board/${boardId}`, {
    cache: 'no-store',
  });
  if (res.ok) return res.json();
}
