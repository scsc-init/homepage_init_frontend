// src/app/executive/user/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import UserList from './UserList';
import EnrollManagementPanel from './EnrollManagementPanel';
import OldboyManageMentPanel from './OldboyManagementPanel';
import { fetchUsers, fetchMajors } from '@/util/fetchAPIData';
import '../page.css';

export default async function ExecutiveUserPage() {
  const [users, majors] = await Promise.all([fetchUsers(), fetchMajors()]);
  const safeUsers = Array.isArray(users) ? users : [];
  const usersSortedByRole = Array.from(new Map(safeUsers.map((user) => [user.id, user])).values());
  usersSortedByRole.sort((a, b) => a.role - b.role);

  return (
    <WithAuthorization>
      <div className="admin-panel">
        <h2>유저 관리</h2>
        <div className="adm-section">
          <UserList users={usersSortedByRole} majors={majors} />
        </div>
        <div className="adm-section">
          <EnrollManagementPanel />
        </div>
        <div className="adm-section">
          <OldboyManageMentPanel users={usersSortedByRole} />
        </div>
      </div>
    </WithAuthorization>
  );
}
