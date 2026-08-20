import styles from './IgDetail.module.css';
import { getMemberIdentity } from '@/app/(ig)/utils/memberIdentity';
import MembersLoginPrompt from './MembersLoginPrompt';

const MEMBER_CONFIG = {
  sig: {
    headingId: 'sig-members-heading',
    title: '시그 인원',
  },
  pig: {
    headingId: 'pig-members-heading',
    title: '피그 인원',
  },
};

export default function IgMembers({ kind, owner, members, visible = true }) {
  const config = MEMBER_CONFIG[kind];

  if (!visible) {
    return (
      <section className={styles.membersSection} aria-labelledby={config.headingId}>
        <div className={`${styles.membersHeader} ${styles.membersHeaderLocked}`}>
          <h2 id={config.headingId} className={styles.membersTitle}>
            {config.title}
          </h2>
          <MembersLoginPrompt />
        </div>
        <ul className={styles.memberList} aria-hidden="true">
          <li className={`${styles.memberPlaceholderChip} ${styles.memberPlaceholderOwner}`}>
            가나다
          </li>
          <li className={`${styles.memberPlaceholderChip} ${styles.memberPlaceholderFading}`}>
            라마바
          </li>
        </ul>
      </section>
    );
  }

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
    <section className={styles.membersSection} aria-labelledby={config.headingId}>
      <div className={styles.membersHeader}>
        <h2 id={config.headingId} className={styles.membersTitle}>
          {config.title}
        </h2>
        <span className={styles.membersCount}>{count}명</span>
      </div>

      {count === 0 ? (
        <div className={styles.membersEmpty}>가입한 인원이 없습니다.</div>
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
