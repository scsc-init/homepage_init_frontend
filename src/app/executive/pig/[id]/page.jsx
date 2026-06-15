// src/app/executive/pig/[id]/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import PigEdit from './PigEdit';
import IgMembersPanel from '../../IgMembersPanel';
import { fetchBackendServerJson } from '@/util/fetch/server';
import { fetchUsers } from '@/util/fetch/server-util';
import * as AdminLayout from '@/components/AdminLayout';

export default async function ExecutivePigPage({ params }) {
  const [pigMeta, users] = await Promise.allSettled([
    fetchBackendServerJson('GET', `/api/sig/${(await params).id}`),
    fetchUsers(),
  ]);
  if (pigMeta.status !== 'fulfilled') {
    return null;
  }

  const raw = pigMeta.value;
  const pigContent = raw?.content?.content ?? raw?.content ?? '';
  const pig = { ...raw, content: pigContent };

  return (
    <WithAuthorization>
      <AdminLayout.AdminPanel>
        <h2>PIG 관리</h2>
        <AdminLayout.AdminSection>
          <PigEdit pig={pig} />
        </AdminLayout.AdminSection>
        <h2>PIG 구성원 관리</h2>
        <AdminLayout.AdminSection>
          <IgMembersPanel
            is_pig
            ig={pig}
            users={users.status === 'fulfilled' ? users.value : []}
          />
        </AdminLayout.AdminSection>
      </AdminLayout.AdminPanel>
    </WithAuthorization>
  );
}
