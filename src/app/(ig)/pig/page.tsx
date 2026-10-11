import type { IgSearchParams } from '@/app/(ig)/components/listview/types';
import IgListPage from '@/app/(ig)/components/listview/IgListPage';

export const metadata = { title: 'PIG' };

export default async function PigListPage({ searchParams }: { searchParams: IgSearchParams }) {
  return <IgListPage kind="pig" searchParams={searchParams} />;
}
