import { getTranslations } from 'next-intl/server';
import type { IgSearchParams } from '@/app/(ig)/components/listview/types';
import IgListPage from '@/app/(ig)/components/listview/IgListPage';

export async function generateMetadata() {
  const t = await getTranslations('Ig');
  return { title: t('kind.small-group') };
}

export default async function SmallGroupListPage({
  searchParams,
}: {
  searchParams: IgSearchParams;
}) {
  return <IgListPage kind="small-group" searchParams={searchParams} />;
}
