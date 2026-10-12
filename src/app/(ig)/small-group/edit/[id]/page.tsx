import type { IgParams } from '@/app/(ig)/components/detail/types';
import EditIgPage from '@/app/(ig)/components/editor/EditIgPage';

export const metadata = { title: '소모임' };

export default async function EditSmallGroupPage({ params }: { params: IgParams }) {
  return <EditIgPage kind="small-group" params={params} />;
}
