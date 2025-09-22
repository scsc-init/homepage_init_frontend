// src/app/executive/user/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import UserList from './UserList';
import EnrollManagementPanel from './EnrollManagementPanel';
import OldboyManageMentPanel from './OldboyManagementPanel';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';
import '../page.css';

export default async function ExecutiveUserPage() {
  const [users, majors] = await Promise.all([fetchUsersByRoles(), fetchMajors()]);

  return (
    <WithAuthorization>
      <div className="admin-panel">
        <h2>유저 관리</h2>
        <div className="adm-section">
          <UserList users={users} majors={majors} />
        </div>
        <div className="adm-section">
          <EnrollManagementPanel />
        </div>
        <div className="adm-section">
          <OldboyManageMentPanel users={users ?? []} />
        </div>
      </div>
    </WithAuthorization>
  );
}

async function fetchUsersByRoles() {
  const res = await fetch(`${getBaseUrl()}/api/users`, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });
  if (!res.ok) return;

  const result = await res.json();
  const resultUnique = Array.from(new Map(result.map((user) => [user.id, user])).values());
  resultUnique.sort((a, b) => a.role - b.role);
  return resultUnique;
}

async function fetchMajors() {
  const res = await fetch(`${getBaseUrl()}/api/majors`, {
    headers: { 'x-api-secret': getApiSecret() },
    cache: 'no-store',
  });
  if (res.ok) return await res.json();
}
