import CreateIgClient from '@/app/(ig)/components/editor/CreateIgClient';
import { fetchGlobalStatus } from '@/util/fetch/server-util';

export default async function CreateIgPage({ kind }) {
  const [scscGlobalStatus] = await Promise.allSettled([fetchGlobalStatus()]);
  return (
    <CreateIgClient
      kind={kind}
      scscGlobalStatus={
        scscGlobalStatus.status === 'fulfilled' ? scscGlobalStatus.value.status : null
      }
    />
  );
}
