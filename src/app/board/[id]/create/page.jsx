// app/board/[id]/create/page.jsx
import CreateBoardArticleClient from './CreateBoardArticleClient';
import { fetchBackendServer } from '@/util/fetch/server';

export default async function CreateBoardPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const boardInfo = await fetchBoardInfo(resolvedParams.id);
  const rawBoardType = resolvedSearchParams?.t;
  const boardType = rawBoardType === 'image' || rawBoardType === 'text' ? rawBoardType : 'text';
  return <CreateBoardArticleClient boardInfo={boardInfo} boardType={boardType} />;
}

async function fetchBoardInfo(boardId) {
  const res = await fetchBackendServer('GET', `/api/board/${boardId}`);
  if (res.ok) return res.json();
}
