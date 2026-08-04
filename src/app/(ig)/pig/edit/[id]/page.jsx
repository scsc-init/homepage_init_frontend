import EditIgPage from '@/app/(ig)/components/editor/EditIgPage';

export const metadata = { title: 'PIG' };

export default async function EditPigPage({ params }) {
  return <EditIgPage kind="pig" params={params} />;
}
