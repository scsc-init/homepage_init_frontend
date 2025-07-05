// src/app/executive/user/page.jsx

import WithAuthorization from "@/components/WithAuthorization";
import UserList from "./UserList";
import EnrollManagementPanel from "./EnrollManagementPanel";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

export default async function ExecutiveUserPage() {
  const users = await fetchUsersByRoles();
  const majors = await fetchMajors();

  return (
    <WithAuthorization>
      <div style={{ padding: "2rem" }}>
        <h2>유저 관리</h2>
        <UserList users={users} majors={majors} />
        <EnrollManagementPanel />
      </div>
    </WithAuthorization>
  );
}

async function fetchUsersByRoles() {
  const res = await fetch(`${getBaseUrl()}/api/users`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  if (!res.ok) return;

  const result = await res.json();
  const resultUnique = Array.from(
    new Map(result.map((user) => [user.id, user])).values(),
  );
  resultUnique.sort((a, b) => a.role - b.role);
  return resultUnique;
}

async function fetchMajors() {
  const res = await fetch(`${getBaseUrl()}/api/majors`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  if (res.ok) return await res.json();
}
