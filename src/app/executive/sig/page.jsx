// src/app/executive/sig/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import SigList from './SigList';
import SigMembersPanel from './SigMembersPanel';
import { fetchSigs, fetchUsers } from '@/util/fetchAPIData';
import '../page.css';

export default async function ExecutiveSigPage() {
  const [sigs, users] = await Promise.all([fetchSigs(), fetchUsers()]);

  return (
    <WithAuthorization>
      <div className="admin-panel">
        <h2>SIG 관리</h2>
        <div className="adm-section">
          <SigList sigs={Array.isArray(sigs) ? sigs : []} />
        </div>
        <h2>SIG 구성원 관리</h2>
        <div className="adm-section">
          <SigMembersPanel sigs={Array.isArray(sigs) ? sigs : []} users={Array.isArray(users) ? users : []} />
        </div>
      </div>
    </WithAuthorization>
  );
}
