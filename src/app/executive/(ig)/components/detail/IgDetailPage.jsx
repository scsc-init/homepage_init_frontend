import WithAuthorization from '@/components/WithAuthorization';
import { fetchBackendServerJson } from '@/util/fetch/server';
import { fetchUserSummaries } from '@/util/fetch/server-util';
import * as AdminLayout from '@/components/AdminLayout';
import IgEdit from './IgEdit';
import IgMembersPanel from './IgMembersPanel';

export default async function IgDetailPage({ params, igType }) {
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

  const isSig = igType === 'SIG';
  const isPig = igType === 'PIG';

  return (
    <WithAuthorization>
      <AdminLayout.AdminPanel>
        <h2>{igType} 관리</h2>
        <AdminLayout.AdminSection>
          <IgEdit ig={ig} is_sig={isSig} is_pig={isPig} />
        </AdminLayout.AdminSection>

        <h2>{igType} 구성원 관리</h2>
        <AdminLayout.AdminSection>
          <IgMembersPanel
            ig={ig}
            users={users.status === 'fulfilled' ? users.value : []}
            is_sig={isSig}
            is_pig={isPig}
          />
        </AdminLayout.AdminSection>
      </AdminLayout.AdminPanel>
    </WithAuthorization>
  );
}
