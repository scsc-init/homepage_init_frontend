import { fetchBackendServer } from '@/util/fetch/server';
import WithAuthorization from '@/components/WithAuthorization';
import { redirect } from 'next/navigation';
import WList from './WList';
import * as AdminLayout from '@/components/AdminLayout';

export default async function HTMLManagementPage() {
  const res = await fetchBackendServer('GET', '/api/executive/ws');
  if (!res.ok) {
    redirect('/us/login');
  }
  const wMetas = await res.json();
  return (
    <WithAuthorization>
      <AdminLayout.AdminPanel>
        <h2>HTML 페이지 관리</h2>
        <WList wMetas={wMetas} />
      </AdminLayout.AdminPanel>
    </WithAuthorization>
  );
}
