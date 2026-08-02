import IgListPage from '@/app/(ig)/components/listview/IgListPage';

export const metadata = { title: 'SIG' };

export default async function SigListPage({ searchParams }) {
  return <IgListPage kind="sig" searchParams={searchParams} />;
}
