import { getTranslations } from 'next-intl/server';
import { fetchBackendServer } from '@/util/fetch/server';
import WithAuthorization from '@/components/WithAuthorization';
import { redirect } from 'next/navigation';
import WList from './WList';
import * as AdminLayout from '@/app/executive/AdminLayout';

export default async function HTMLManagementPage() {
  const t = await getTranslations('Executive');
  const res = await fetchBackendServer('GET', '/api/executive/ws');
  if (!res.ok) {
    redirect('/us/login');
  }
  const wMetas = await res.json();
  return (
    <WithAuthorization>
      <AdminLayout.AdminPanel>
        <h2>{t('htmlManagement')}</h2>
        <WList wMetas={wMetas} />
      </AdminLayout.AdminPanel>
    </WithAuthorization>
  );
}
