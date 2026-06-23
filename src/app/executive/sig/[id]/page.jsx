// src/app/executive/sig/[id]/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import SigEdit from './SigEdit';
import IgMembersPanel from '../../IgMembersPanel';
import { fetchBackendServerJson } from '@/util/fetch/server';
import { fetchUserSummaries } from '@/util/fetch/server-util';
import * as AdminLayout from '@/components/AdminLayout';

export default async function ExecutiveSigPage({ params }) {
  const [sigMeta, users] = await Promise.allSettled([
    fetchBackendServerJson('GET', `/api/sig/${(await params).id}`),
    fetchUserSummaries(),
  ]);
  if (sigMeta.status !== 'fulfilled') {
    return null;
  }

  const raw = sigMeta.value;
  const sigContent = raw?.content?.content ?? '';
  const sig = { ...raw, content: sigContent };

  return (
    <WithAuthorization>
      <AdminLayout.AdminPanel>
        <h2>SIG 관리</h2>
        <AdminLayout.AdminSection>
          <SigEdit sig={sig} />
        </AdminLayout.AdminSection>
        <h2>SIG 구성원 관리</h2>
        <AdminLayout.AdminSection>
          <IgMembersPanel
            is_sig
            ig={sig}
            users={users.status === 'fulfilled' ? users.value : []}
          />
        </AdminLayout.AdminSection>
      </AdminLayout.AdminPanel>
    </WithAuthorization>
  );
}
