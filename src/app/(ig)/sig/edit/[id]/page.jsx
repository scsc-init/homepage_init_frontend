import EditIgPage from '@/app/(ig)/components/editor/EditIgPage';

export const metadata = { title: 'SIG' };

export default async function EditSigPage({ params }) {
  return <EditIgPage kind="sig" params={params} />;
}
