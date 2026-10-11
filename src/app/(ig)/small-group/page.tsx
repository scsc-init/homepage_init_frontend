import type { IgSearchParams } from '@/app/(ig)/components/listview/types';
import IgListPage from '@/app/(ig)/components/listview/IgListPage';

export const metadata = { title: '소모임' };

export default async function SmallGroupListPage({
  searchParams,
}: {
  searchParams: IgSearchParams;
}) {
  return <IgListPage kind="small-group" searchParams={searchParams} />;
}
