import IgListPage from '@/app/(ig)/components/listview/IgListPage';

export const metadata = { title: '소모임' };

export default async function SmallGroupListPage({ searchParams }) {
  return <IgListPage kind="small-group" searchParams={searchParams} />;
}
