// src/app/executive/pig/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import PigList from './PigList';
import { fetchBackendServerJson } from '@/util/fetch/server';
import * as AdminLayout from '@/components/AdminLayout';

export default async function ExecutivePigPage() {
  const [pigMetas, users] = await Promise.allSettled([
    fetchBackendServerJson('GET', '/api/sigs', { query: { tag: 'PIG' } }),
  ]);
  if (pigMetas.status !== 'fulfilled') return null;

  const pigs = pigMetas.value.map((p) => ({
    ...p,
    ownerName: p.owner_user.name,
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
