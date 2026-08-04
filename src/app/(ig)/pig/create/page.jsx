import CreateIgPage from '@/app/(ig)/components/editor/CreateIgPage';

export const metadata = { title: 'PIG' };

export default async function CreatePigPage() {
  return <CreateIgPage kind="pig" />;
}
