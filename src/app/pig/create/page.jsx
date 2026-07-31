import CreateIgClient from '@/app/(ig)/CreateIgClient';
import { fetchGlobalStatus } from '@/util/fetch/server-util';

export const metadata = { title: 'PIG' };

export default async function CreatePigPage() {
  const [scscGlobalStatus] = await Promise.allSettled([fetchGlobalStatus()]);
  return (
    <CreateIgClient
      kind="pig"
      scscGlobalStatus={
        scscGlobalStatus.status === 'fulfilled' ? scscGlobalStatus.value.status : null
      }
    />
  );
}
