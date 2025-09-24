// src/app/executive/user/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import '../page.css';
import WList from './WList';

export default async function HTMLManagementPage() {
  return (
    <WithAuthorization>
      <div className="admin-panel">
        <h2>HTML 페이지 관리</h2>
        <WList />
      </div>
    </WithAuthorization>
  );
}
