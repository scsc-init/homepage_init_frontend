import { getTranslations } from 'next-intl/server';
import WithAuthorization from '@/components/WithAuthorization';
import { fetchBackendServerJson } from '@/util/fetch/server';
import { fetchUserSummaries } from '@/util/fetch/server-util';
import * as AdminLayout from '@/app/executive/AdminLayout';
import IgEdit from './IgEdit';
import IgMembersPanel from './IgMembersPanel';

export default async function IgDetailPage({ params, igType }) {
  const t = await getTranslations('Executive');
  const { id } = await params;

  const [igMeta, users] = await Promise.allSettled([
    fetchBackendServerJson('GET', `/api/sig/${id}`),
    fetchUserSummaries(),
  ]);

  if (igMeta.status !== 'fulfilled') {
    return null;
  }

  const raw = igMeta.value;
  const ig = {
    ...raw,
    content: raw?.content?.content ?? '',
  };

  const igLabel = t.raw('groupLabels')[igType];

  return (
    <WithAuthorization>
      <AdminLayout.AdminPanel>
        <h2>{t('groupManagement', { value0: igLabel ?? '' })}</h2>
        <AdminLayout.AdminSection>
          <IgEdit igType={igType} ig={ig} />
        </AdminLayout.AdminSection>

        <h2>{t('groupMembers', { value0: igLabel ?? '' })}</h2>
        <AdminLayout.AdminSection>
          <IgMembersPanel ig={ig} users={users.status === 'fulfilled' ? users.value : []} />
        </AdminLayout.AdminSection>
      </AdminLayout.AdminPanel>
    </WithAuthorization>
  );
}
