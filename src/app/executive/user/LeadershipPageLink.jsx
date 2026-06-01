'use client';

import { useMe } from '@/util/hooks/useMe';
import * as AdminLayout from '@/components/AdminLayout';

export default function LeadershipPageLink() {
  const { me } = useMe();
  const canManageLeadership = (me?.role ?? 0) >= 1000;

  if (!canManageLeadership) return null;

  return (
    <AdminLayout.AdminSection>
      <AdminLayout.AdminLinkButton href="/executive/user/leadership">
        회장단 전용 페이지로 이동
      </AdminLayout.AdminLinkButton>
    </AdminLayout.AdminSection>
  );
}
