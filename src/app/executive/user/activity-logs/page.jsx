export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import WithAuthorization from '@/components/WithAuthorization';
import * as AdminLayout from '@/components/AdminLayout';
import ActivityLogList from './ActivityLogList';
import { fetchUserSummaries } from '@/util/fetch/server-util';

export default async function UserActivityLogsPage() {
  const users = await fetchUserSummaries().catch(() => []);

  return (
    <WithAuthorization>
      <AdminLayout.AdminPanel>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{ margin: 0 }}>유저 활동 기록</h2>
          <Link href="/executive/user">유저 관리로 돌아가기</Link>
        </div>

        <p style={{ marginBottom: '1rem', color: '#767676' }}>
          유저 가입, 등록, 시그 가입/탈퇴, 시그장 임명 기록을 조회합니다.
        </p>

        <AdminLayout.AdminSection>
          <ActivityLogList users={users} />
        </AdminLayout.AdminSection>
      </AdminLayout.AdminPanel>
    </WithAuthorization>
  );
}
