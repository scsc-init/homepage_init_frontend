// app/board/[id]/create/page.jsx
import CreateBoardArticleClient from './CreateBoardArticleClient';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';

export default async function CreateBoardPage({ params }) {
  const boardInfo = await fetchBoardInfo(params.id);
  return <CreateBoardArticleClient boardInfo={boardInfo} />;
}

async function fetchBoardInfo(boardId) {
  const res = await fetch(`${getBaseUrl()}/api/board/${boardId}`, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });
  if (res.ok) return res.json();
  else console.error(err);
}
