import WithAuthorization from '@/components/WithAuthorization';
import { fetchBackendServerJson } from '@/util/fetch/server';
import * as AdminLayout from '@/app/executive/AdminLayout';
import IgList from './IgList';
import { IG_LABELS } from '../igTypes';

export default async function IgListPage({ igType }) {
  const igLabel = IG_LABELS[igType];
  const [igMetas] = await Promise.allSettled([
    fetchBackendServerJson('GET', '/api/sigs', {
      query: { tag: igLabel },
    }),
  ]);

  if (igMetas.status !== 'fulfilled') {
    return null;
  }

  const igs = igMetas.value.map((ig) => ({
    ...ig,
    ownerName: ig.owner_user?.name ?? '',
  }));

  return (
    <WithAuthorization>
      <AdminLayout.AdminPanel>
        <h2>{igLabel} 관리</h2>
        <AdminLayout.AdminSection>
          <IgList igs={igs} igType={igType} />
        </AdminLayout.AdminSection>
      </AdminLayout.AdminPanel>
    </WithAuthorization>
  );
}
