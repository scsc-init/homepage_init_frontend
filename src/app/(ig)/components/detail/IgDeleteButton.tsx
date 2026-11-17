'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import { readError } from '@/app/(ig)/utils/readError';
import { replaceLoginWithRedirect } from '@/util/loginRedirect';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './IgDetail.module.css';
import type { IgKind } from './types';

type IgDeleteButtonProps = {
  kind: IgKind;
  itemId: string;
  canDelete: boolean;
  isOwner: boolean;
};

export default function IgDeleteButton({
  kind,
  itemId,
  canDelete,
  isOwner,
}: IgDeleteButtonProps) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const t = useTranslations('Ig');
  const upperLabel = t(`kind.${kind}`);

  const deleteBySelf = async () => {
    try {
      setPending(true);
      const res = await fetchBackendClient(`/api/sig/${itemId}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        alert(t('deactivateSuccess', { kind: upperLabel }));
        router.refresh();
      } else if (res.status === 401) {
        alert(t('loginRequired'));
        replaceLoginWithRedirect(router);
      } else {
        alert(t('deactivateFailure', { kind: upperLabel }) + (await readError(res)));
      }
    } catch (e) {
      alert(
        t('deactivateFailure', { kind: upperLabel }) +
          ((e as { message?: string } | null)?.message || t('networkError')),
      );
    } finally {
      setPending(false);
    }
  };

  const deleteByExec = async () => {
    try {
      setPending(true);
      const res = await fetchBackendClient(`/api/sig/${itemId}/delete/executive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        alert(t('deactivateSuccess', { kind: upperLabel }));
        router.refresh();
      } else if (res.status === 401) {
        alert(t('loginRequired'));
        replaceLoginWithRedirect(router);
      } else {
        alert(t('deactivateFailure', { kind: upperLabel }) + (await readError(res)));
      }
    } catch (e) {
      alert(
        t('deactivateFailure', { kind: upperLabel }) +
          ((e as { message?: string } | null)?.message || t('networkError')),
      );
    } finally {
      setPending(false);
    }
  };

  return canDelete ? (
    <button
      type="button"
      className={`${styles.actionButton} ${styles.deleteButton}`}
      onClick={isOwner ? deleteBySelf : deleteByExec}
      disabled={pending}
      aria-busy={pending}
    >
      {t('deactivate')}
    </button>
  ) : null;
}
