'use client';

import { useTranslations } from 'next-intl';
import { useMe } from '@/util/hooks/useMe';
import * as AdminLayout from '@/app/executive/AdminLayout';

export default function LeadershipPageLink() {
  const t = useTranslations('Executive');
  const { me } = useMe();
  const canManageLeadership = (me?.role ?? 0) >= 1000;

  if (!canManageLeadership) return null;

  return (
    <AdminLayout.AdminSection>
      <AdminLayout.AdminLinkButton href="/executive/user/leadership">
        {t('leadershipLink')}
      </AdminLayout.AdminLinkButton>
    </AdminLayout.AdminSection>
  );
}
