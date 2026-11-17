import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import 'highlight.js/styles/github.css';
import IgClient from '@/app/(ig)/components/detail/IgClient';
import { fetchBackendServer } from '@/util/fetch/server';
import type { IgDetail, IgKind, IgParams } from './types';

export default async function IgDetailPage({
  kind,
  params,
}: {
  kind: IgKind;
  params: IgParams;
}) {
  const t = await getTranslations('Ig');
  const { id } = await params;

  const itemRes = await fetchBackendServer('GET', `/api/sig/${id}`);
  if (!itemRes.ok) {
    if (itemRes.status === 404) notFound();
    return (
      <div className="p-6 text-center text-red-600">
        {t('missing', { kind: t(`kind.${kind}`) })}
      </div>
    );
  }
  const item: IgDetail = await itemRes.json();

  const rawMembers = item.members;
  const membersVisible = Array.isArray(rawMembers);
  const members = membersVisible
    ? rawMembers.map((m) => m?.user ?? m).filter((user) => Boolean(user?.is_active))
    : [];

  const article = item.content ?? { content: '' };

  return (
    <IgClient
      kind={kind}
      item={item}
      members={members}
      membersVisible={membersVisible}
      articleContent={article.content}
      itemId={id}
    />
  );
}
