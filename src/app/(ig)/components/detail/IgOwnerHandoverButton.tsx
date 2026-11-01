'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import { readError } from '@/app/(ig)/utils/readError';
import { replaceLoginWithRedirect } from '@/util/loginRedirect';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styles from './IgDetail.module.css';
import { getMemberIdentity } from '@/app/(ig)/utils/memberIdentity';
import type { IgDetail, IgKind, IgMember } from './types';

type IgOwnerHandoverButtonProps = {
  kind: IgKind;
  igId: string;
  members: IgMember[];
  owner: IgDetail['owner'];
};

export default function IgOwnerHandoverButton({
  kind,
  igId,
  members,
  owner,
}: IgOwnerHandoverButtonProps) {
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('Ig');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const kindLabel = t(`kind.${kind}`);
  const memberData = Array.isArray(members) ? members : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node | null)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handoverOwner = async (nextOwner: IgMember) => {
    if (!window.confirm(t('handoverConfirm'))) return;
    try {
      setPending(true);
      const res = await fetchBackendClient(`/api/sig/${igId}/handover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_owner: getMemberIdentity(nextOwner) }),
      });

      if (res.ok) {
        alert(t('handoverSuccess', { kind: kindLabel }));
        router.refresh();
      } else if (res.status === 401) {
        alert(t('loginRequired'));
        replaceLoginWithRedirect(router);
      } else {
        alert(t('handoverFailure', { kind: kindLabel }) + (await readError(res)));
      }
    } catch (e) {
      alert(
        t('handoverFailure', { kind: kindLabel }) +
          ((e as { message?: string } | null)?.message || t('networkError')),
      );
    } finally {
      setPending(false);
    }
  };

  const candidates = memberData.filter((member) => getMemberIdentity(member) !== owner);

  return (
    <div className={styles.memberDropdown} ref={dropdownRef}>
      <button
        type="button"
        className={styles.memberButton}
        onClick={() => setOpen((prev) => !prev)}
      >
        {t('handover', { kind: kindLabel })}
      </button>
      {open ? (
        <div className={`${styles.memberMenu} ${styles.fixedWidth}`}>
          {candidates.length === 0 ? (
            <button type="button" onClick={() => setOpen(false)}>
              {t('handoverEmpty')}
            </button>
          ) : (
            <ul className={styles.memberMenuList}>
              {candidates.map((member) => (
                <li key={getMemberIdentity(member)}>
                  <button
                    type="button"
                    disabled={pending}
                    aria-busy={pending}
                    onClick={() => handoverOwner(member)}
                  >
                    {t('handoverTo', { name: member.name })}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
