type Board = {
  id: number;
  name: string;
  description: string;
  board_type: 'TEXT' | 'NONE' | 'FILE' | 'IMAGE';
};
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
import CreateBoardArticleClient from './CreateBoardArticleClient';
import { fetchBackendServer } from '@/util/fetch/server';

export default async function CreateBoardPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const boardInfo = await fetchBoardInfo(resolvedParams.id);
  if (!boardInfo) {
    return <div>게시판 정보를 불러올 수 없습니다.</div>;
  }
  const rawBoardType = resolvedSearchParams?.t;
  const fallbackBoardType =
    boardInfo?.board_type === 'IMAGE'
      ? 'image'
      : boardInfo?.board_type === 'FILE'
        ? 'file'
        : 'text';
  const boardType =
    rawBoardType === 'image' || rawBoardType === 'text' || rawBoardType === 'file'
      ? rawBoardType
      : fallbackBoardType;
  return <CreateBoardArticleClient boardInfo={boardInfo} boardType={boardType} />;
}

async function fetchBoardInfo(boardId: string): Promise<Board | undefined> {
  const res = await fetchBackendServer('GET', `/api/board/${boardId}`);
  if (res.ok) return res.json();
}
