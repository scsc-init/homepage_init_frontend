import CreateIgPage from '@/app/(ig)/components/editor/CreateIgPage';

export const metadata = { title: '소모임' };

export default async function CreateSmallGroupPage() {
  return <CreateIgPage kind="small-group" />;
}
