// src/app/executive/sig/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import SigList from './SigList';
import { fetchBackendServerJson } from '@/util/fetch/server';
import * as AdminLayout from '@/components/AdminLayout';

export default async function ExecutiveSigPage() {
  const [sigMetas] = await Promise.allSettled([
    fetchBackendServerJson('GET', '/api/sigs', { query: { tag: 'SIG' } }),
  ]);
  if (sigMetas.status !== 'fulfilled') return null;

  const sigs = sigMetas.value.map((s) => ({
    ...s,
    ownerName: s.owner_user.name,
  }));

  return (
    <WithAuthorization>
      <AdminLayout.AdminPanel>
        <h2>SIG 관리</h2>
        <AdminLayout.AdminSection>
          <SigList sigs={sigs} />
        </AdminLayout.AdminSection>
      </AdminLayout.AdminPanel>
    </WithAuthorization>
  );
}
