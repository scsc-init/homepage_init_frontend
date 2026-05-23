// src/app/executive/pig/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import PigList from './PigList';
import { fetchBackendServerJson } from '@/util/fetch/server';
import { fetchUsers } from '@/util/fetch/server-util';
import * as AdminLayout from '@/components/AdminLayout';

export default async function ExecutivePigPage() {
  const [pigMetas, users] = await Promise.allSettled([
    fetchBackendServerJson('GET', '/api/pigs'),
    fetchUsers(),
  ]);
  if (pigMetas.status !== 'fulfilled' || users.status !== 'fulfilled') return null;

  const pigs = pigMetas.value.map((p) => ({
    ...p,
    ownerName: users.value.find((u) => u.id === p.owner)?.name,
  }));

  return (
    <WithAuthorization>
      <AdminLayout.AdminPanel>
        <h2>PIG 관리</h2>
        <AdminLayout.AdminSection>
          <PigList pigs={pigs} />
        </AdminLayout.AdminSection>
      </AdminLayout.AdminPanel>
    </WithAuthorization>
  );
}
