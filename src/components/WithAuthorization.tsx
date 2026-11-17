'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useMe } from '@/util/hooks/useMe';

type WithAuthorizationProps = {
  children: ReactNode;
};

export default function WithAuthorization({ children }: WithAuthorizationProps): ReactNode {
  const { me, isLoading } = useMe();
  const t = useTranslations('WithAuthorization');

  if (isLoading) return <p>{t('checking')}</p>;

  if (!me) {
    return <p style={{ color: 'crimson' }}>{t('noPermission')}</p>;
  }

  const allowed = typeof me.role === 'number' && me.role >= 500;

  if (!allowed) {
    return <p style={{ color: 'crimson' }}>{t('noPermission')}</p>;
  }

  return children;
}
