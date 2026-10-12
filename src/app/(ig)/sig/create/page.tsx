import CreateIgPage from '@/app/(ig)/components/editor/CreateIgPage';

export const metadata = { title: 'SIG' };

export default async function CreateSigPage() {
  return <CreateIgPage kind="sig" />;
}
