import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import WithAuthorization from '@/components/WithAuthorization';
import { authOptions } from '@/util/authOptions';
import { fetchBackendServer } from '@/util/fetch/server';
import ExecutiveSidebar from './ExecutiveSidebar';
import styles from './layout.module.css';

export const dynamic = 'force-dynamic';

const EXECUTIVE_ROLE_LEVEL = 500;

function toRoleNumber(value) {
  if (typeof value === 'number') return value;

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return null;
}

function isExecutiveRole(value) {
  const numericRole = toRoleNumber(value);
  if (numericRole !== null) return numericRole >= EXECUTIVE_ROLE_LEVEL;

  if (typeof value === 'string') {
    return ['executive', 'president'].includes(value.toLowerCase());
  }

  return false;
}

function getRoleFromSession(session) {
  return (
    session?.userProfile?.role ??
    session?.user?.role ??
    session?.profile?.role ??
    session?.role ??
    null
  );
}

async function getRoleFromBackendProfile() {
  const response = await fetchBackendServer('GET', '/api/user/profile');

  if (!response.ok) {
    return null;
  }

  const profile = await response.json().catch(() => null);

  return (
    profile?.role ??
    profile?.userProfile?.role ??
    profile?.user?.role ??
    profile?.profile?.role ??
    null
  );
}

async function requireExecutiveSession() {
  const session = await getServerSession(authOptions);

  if (!session?.backendJwt) {
    redirect('/us/login');
  }

  const sessionRole = getRoleFromSession(session);

  if (isExecutiveRole(sessionRole)) {
    return;
  }

  const backendRole = await getRoleFromBackendProfile();

  if (isExecutiveRole(backendRole)) {
    return;
  }

  notFound();
}

export default async function ExecutiveLayout({ children }) {
  await requireExecutiveSession();

  return (
    <WithAuthorization>
      <div className={styles.shell}>
        <ExecutiveSidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </WithAuthorization>
  );
}
