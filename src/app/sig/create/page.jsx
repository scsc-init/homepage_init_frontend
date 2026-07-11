import CreateIgClient from '@/app/(ig)/CreateIgClient';
import { fetchGlobalStatus } from '@/util/fetch/server-util';

export const metadata = { title: 'SIG' };

export default async function CreateSigPage() {
  const [scscGlobalStatus] = await Promise.allSettled([fetchGlobalStatus()]);
  return (
    <CreateIgClient
      kind="sig"
      scscGlobalStatus={
        scscGlobalStatus.status === 'fulfilled' ? scscGlobalStatus.value.status : null
      }
    />
  );
}
