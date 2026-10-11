import type { IgParams } from '@/app/(ig)/components/detail/types';
import EditIgPage from '@/app/(ig)/components/editor/EditIgPage';

export const metadata = { title: 'SIG' };

export default async function EditSigPage({ params }: { params: IgParams }) {
  return <EditIgPage kind="sig" params={params} />;
}
