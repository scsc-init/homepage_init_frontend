import { useTranslations } from 'next-intl';
import styles from './IgDetail.module.css';
import { getMemberIdentity } from '@/app/(ig)/utils/memberIdentity';
import type { IgDetail, IgKind, IgMember } from './types';

type IgMembersProps = {
  kind: IgKind;
  owner: IgDetail['owner'];
  members: IgMember[];
  visible?: boolean;
};

export default function IgMembers({ kind, owner, members, visible = true }: IgMembersProps) {
  const t = useTranslations('Ig');
  const headingId = `${kind}-members-heading`;

  if (!visible) return null;

  const rawList = Array.isArray(members) ? members : [];
  const ownerIndex = !!owner ? rawList.findIndex((m) => getMemberIdentity(m) === owner) : -1;
  const list =
    ownerIndex === -1
      ? rawList
      : [
          rawList[ownerIndex],
          ...rawList.slice(0, ownerIndex),
          ...rawList.slice(ownerIndex + 1),
        ];
  const count = list.length;

  return (
    <section className={styles.membersSection} aria-labelledby={headingId}>
      <div className={styles.membersHeader}>
        <h2 id={headingId} className={styles.membersTitle}>
          {t('members', { kind: t(`kind.${kind}`) })}
        </h2>
        <span className={styles.membersCount}>{t('memberCount', { count })}</span>
      </div>

      {count === 0 ? (
        <div className={styles.membersEmpty}>{t('noMembers')}</div>
      ) : (
        <ul className={styles.memberList}>
          {list.map((m) =>
            getMemberIdentity(m) === owner ? (
              <li key={getMemberIdentity(m)} className={styles.memberOwner}>
                {m.name}
              </li>
            ) : (
              <li key={getMemberIdentity(m)} className={styles.memberChip}>
                {m.name}
              </li>
            ),
          )}
        </ul>
      )}
    </section>
  );
}
