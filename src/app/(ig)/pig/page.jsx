import IgListPage from '@/app/(ig)/components/listview/IgListPage';

export const metadata = { title: 'PIG' };

export default async function PigListPage({ searchParams }) {
  return <IgListPage kind="pig" searchParams={searchParams} />;
}
