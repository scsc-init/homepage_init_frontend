import { handleApiRequest } from '@/app/api/apiWrapper';
import WithAuthorization from '@/components/WithAuthorization';
import { redirect } from 'next/navigation';
import '../page.css';
import WList from './WList';

export default async function HTMLManagementPage() {
  const res = await handleApiRequest('GET', '/api/executive/ws');
  if (!res.ok) {
    redirect('/us/login');
  }
  const wMetas = await res.json();
  return (
    <WithAuthorization>
      <div className="admin-panel">
        <h2>HTML 페이지 관리</h2>
        <WList wMetas={wMetas} />
      </div>
    </WithAuthorization>
  );
}
