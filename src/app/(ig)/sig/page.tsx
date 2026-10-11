import type { IgSearchParams } from '@/app/(ig)/components/listview/types';
import IgListPage from '@/app/(ig)/components/listview/IgListPage';

export const metadata = { title: 'SIG' };

export default async function SigListPage({ searchParams }: { searchParams: IgSearchParams }) {
  return <IgListPage kind="sig" searchParams={searchParams} />;
}
