import 'highlight.js/styles/github.css';
import IgClient from '@/app/(ig)/components/detail/IgClient';
import { fetchBackendServer } from '@/util/fetch/server';

const DETAIL_CONFIG = {
  sig: {
    missingMessage: '존재하지 않는 SIG입니다.',
  },
  pig: {
    missingMessage: '존재하지 않는 PIG입니다.',
  },
};

export default async function IgDetailPage({ kind, params }) {
  const config = DETAIL_CONFIG[kind];
  const { id } = await params;

  const itemRes = await fetchBackendServer('GET', `/api/sig/${id}`);
  if (!itemRes.ok) {
    return <div className="p-6 text-center text-red-600">{config.missingMessage}</div>;
  }
  const item = await itemRes.json();

  const rawMembers = item.members ?? [];
  const members = Array.isArray(rawMembers)
    ? rawMembers.map((m) => m?.user ?? m).filter((user) => Boolean(user?.is_active))
    : [];

  const article = item.content ?? { content: '' };

  return (
    <IgClient
      kind={kind}
      item={item}
      members={members}
      articleContent={article.content}
      itemId={id}
    />
  );
}
