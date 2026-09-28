import EditIgPage from '@/app/(ig)/components/editor/EditIgPage';

export const metadata = { title: '소모임' };

export default async function EditSmallGroupPage({ params }) {
  return <EditIgPage kind="small-group" params={params} />;
}
