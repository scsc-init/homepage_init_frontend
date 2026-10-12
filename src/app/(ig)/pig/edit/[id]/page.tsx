import type { IgParams } from '@/app/(ig)/components/detail/types';
import EditIgPage from '@/app/(ig)/components/editor/EditIgPage';

export const metadata = { title: 'PIG' };

export default async function EditPigPage({ params }: { params: IgParams }) {
  return <EditIgPage kind="pig" params={params} />;
}
