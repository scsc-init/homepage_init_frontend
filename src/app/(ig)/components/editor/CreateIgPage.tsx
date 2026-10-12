import CreateIgClient from '@/app/(ig)/components/editor/CreateIgClient';
import type { IgKind } from '@/app/(ig)/components/editor/types';
import { fetchGlobalStatus } from '@/util/fetch/server-util';

type CreateIgPageProps = {
  kind: IgKind;
};

export default async function CreateIgPage({ kind }: CreateIgPageProps) {
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
