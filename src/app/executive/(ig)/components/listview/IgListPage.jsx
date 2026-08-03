import WithAuthorization from '@/components/WithAuthorization';
import { fetchBackendServerJson } from '@/util/fetch/server';
import * as AdminLayout from '@/components/AdminLayout';
import IgList from './IgList';

export default async function IgListPage({ igType }) {
  const [igMetas] = await Promise.allSettled([
    fetchBackendServerJson('GET', '/api/sigs', {
      query: { tag: igType },
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
        <h2>{igType} 관리</h2>
        <AdminLayout.AdminSection>
          <IgList igs={igs} igType={igType} />
        </AdminLayout.AdminSection>
      </AdminLayout.AdminPanel>
    </WithAuthorization>
  );
}
