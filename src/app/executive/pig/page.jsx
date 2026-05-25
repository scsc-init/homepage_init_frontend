// src/app/executive/pig/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import PigList from './PigList';
import { safeFetch, fetchUsers } from '@/util/fetchAPIData';
import * as AdminLayout from '@/components/AdminLayout';

export default async function ExecutivePigPage() {
  const [pigMetas, users] = await Promise.allSettled([
    safeFetch('GET', `/api/pigs`),
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
