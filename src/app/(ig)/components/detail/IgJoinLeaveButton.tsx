'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import { readError } from '@/app/(ig)/utils/readError';
import { replaceLoginWithRedirect } from '@/util/loginRedirect';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './IgDetail.module.css';
import type { IgKind } from './types';

type IgJoinLeaveButtonProps = {
  kind: IgKind;
  igId: string;
  initialIsMember?: boolean;
};

export default function IgJoinLeaveButton({
  kind,
  igId,
  initialIsMember = false,
}: IgJoinLeaveButtonProps) {
  const router = useRouter();
  const t = useTranslations('Ig');
  const [isMember, setIsMember] = useState(!!initialIsMember);
  const [pending, setPending] = useState(false);
  const kindLabel = t(`kind.${kind}`);

  const requestMembership = async (nextIsMember: boolean) => {
    const action = nextIsMember ? 'join' : 'leave';
    const successMessage = t(nextIsMember ? 'joinSuccess' : 'leaveSuccess', {
      kind: kindLabel,
    });
    const failurePrefix = t(nextIsMember ? 'joinFailure' : 'leaveFailure', { kind: kindLabel });

    try {
      setPending(true);
      const res = await fetchBackendClient(`/api/sig/${igId}/member/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        alert(successMessage);
        setIsMember(nextIsMember);
        router.refresh();
      } else if (res.status === 401) {
        alert(t('loginRequired'));
        replaceLoginWithRedirect(router);
      } else {
        alert(failurePrefix + (await readError(res)));
      }
    } catch (e) {
      alert(failurePrefix + ((e as { message?: string } | null)?.message || t('networkError')));
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      className={`${styles.actionButton} ${isMember ? styles.leaveButton : styles.joinButton}`}
      onClick={() => requestMembership(!isMember)}
      disabled={pending}
      aria-busy={pending}
    >
      {t(isMember ? 'leave' : 'join')}
    </button>
  );
}
