'use client';

import EditIgButton from '@/app/(ig)/EditIgButton';
import IgContents from '@/app/(ig)/IgContents';
import IgDeleteButton from '@/app/(ig)/IgDeleteButton';
import IgJoinLeaveButton from '@/app/(ig)/IgJoinLeaveButton';
import IgMembers from '@/app/(ig)/IgMembers';
import IgOwnerHandoverButton from '@/app/(ig)/IgOwnerHandoverButton';
import { sortSigPigTags } from '@/components/board/SigPigTags';
import {
  is_sigpig_join_available,
  is_pig_join_available,
  minExecutiveLevel,
  SEMESTER_MAP,
} from '@/util/constants';
import { getMemberIdentity } from './memberIdentity';
import { useMe } from '@/util/hooks/useMe';
import styles from './IgDetail.module.css';

const JOIN_AVAILABILITY = {
  sig: is_sigpig_join_available,
  pig: is_pig_join_available,
};

export default function IgClient({ kind, item, members, articleContent, itemId }) {
  const { me, isLoading } = useMe();
  const isJoinAvailable = JOIN_AVAILABILITY[kind];

  if (!isJoinAvailable) {
    console.error(`IgClient: unsupported kind ${kind}`);
    return null;
  }

  const isMember = members.some((m) => getMemberIdentity(m) === me?.id);
  const canEdit =
    !!me &&
    ((typeof me.role === 'number' && me.role >= minExecutiveLevel) || item?.owner === me?.id);
  const isOwner = !!me && item?.owner === me?.id;
  const semesterLabel = SEMESTER_MAP[Number(item?.semester)] ?? `${item?.semester}`;
  const createdSemesterLabel =
    SEMESTER_MAP[Number(item?.created_semester)] ?? `${item?.created_semester}`;
  const hasCreated = item?.created_year != null && item?.created_semester != null;
  const websites = Array.isArray(item?.websites) ? item.websites : [];
  const normalizedTagText = sortSigPigTags(item?.tags)
    .map((tag) => String(tag?.text ?? '').trim())
    .filter(Boolean);

  return (
    <div className={styles.detailContainer}>
      <h1 className={styles.title}>{item.title}</h1>
      <p className={styles.info}>
        {hasCreated
          ? `최초 생성: ${item.created_year}학년도 ${createdSemesterLabel}학기 · `
          : ''}
        {item.year}학년도 {semesterLabel}학기 · 상태: {item.status}
      </p>
      <p className={styles.description}>{item.description}</p>
      {normalizedTagText.length > 0 ? (
        <div className={styles.tagInline}>
          {normalizedTagText.map((text) => `#${text}`).join(' ')}
        </div>
      ) : null}
      {!isLoading && me ? (
        <div className={styles.actionRow}>
          {isJoinAvailable(item.status, item.is_rolling_admission) ? (
            <IgJoinLeaveButton kind={kind} igId={itemId} initialIsMember={isMember} />
          ) : null}
          <EditIgButton kind={kind} itemId={itemId} canEdit={canEdit} />
          {isOwner ? (
            <IgOwnerHandoverButton
              kind={kind}
              igId={itemId}
              members={members}
              owner={item.owner}
            />
          ) : null}
          <IgDeleteButton kind={kind} itemId={itemId} canDelete={canEdit} isOwner={isOwner} />
        </div>
      ) : null}
      <hr className={styles.divider} />
      <IgContents kind={kind} content={articleContent} />
      <hr className={styles.divider} />
      <IgWebsites kind={kind} websites={websites} />
      <IgMembers kind={kind} owner={item?.owner} members={members} />
    </div>
  );
}

function IgWebsites({ kind, websites }) {
  const headingId = `${kind}-websites-heading`;

  if (!Array.isArray(websites) || websites.length === 0) return null;

  return (
    <section className={styles.websitesSection} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.websitesTitle}>
        관련 웹사이트
      </h2>
      <ul className={styles.websitesList}>
        {websites.map((website, idx) => {
          const label = website?.label?.trim() || website?.url;
          const key = website?.id ?? `${website?.url}-${idx}`;
          return (
            <li key={key} className={styles.websitesItem}>
              <a href={website?.url} target="_blank" rel="noreferrer noopener">
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
