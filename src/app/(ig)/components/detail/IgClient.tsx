'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import EditIgButton from '@/app/(ig)/components/detail/EditIgButton';
import IgContents from '@/app/(ig)/components/detail/IgContents';
import IgDeleteButton from '@/app/(ig)/components/detail/IgDeleteButton';
import IgJoinLeaveButton from '@/app/(ig)/components/detail/IgJoinLeaveButton';
import IgMembers from '@/app/(ig)/components/detail/IgMembers';
import IgOwnerHandoverButton from '@/app/(ig)/components/detail/IgOwnerHandoverButton';
import { sortSigPigTags } from '@/app/(ig)/utils/sortSigPigTags';
import { is_sigpig_join_available, minExecutiveLevel } from '@/util/constants';
import { getMemberIdentity } from '@/app/(ig)/utils/memberIdentity';
import { useMe } from '@/util/hooks/useMe';
import { getKvClient } from '@/util/fetch/client-util';
import styles from './IgDetail.module.css';
import type { IgDetail, IgKind, IgMember, IgWebsite } from './types';

type IgClientProps = {
  kind: IgKind;
  item: IgDetail;
  members: IgMember[];
  membersVisible?: boolean;
  articleContent: string;
  itemId: string;
};

const JOIN_AVAILABILITY = {
  sig: is_sigpig_join_available,
  'small-group': is_sigpig_join_available,
  pig: is_sigpig_join_available,
};

export default function IgClient({
  kind,
  item,
  members,
  membersVisible = true,
  articleContent,
  itemId,
}: IgClientProps) {
  const { me, isLoading } = useMe();
  const t = useTranslations('Ig');
  const [recruitmentDeadline, setRecruitmentDeadline] = useState('');
  const isJoinAvailable = JOIN_AVAILABILITY[kind];

  useEffect(() => {
    if (item.is_rolling_admission !== 'during_recruiting') {
      setRecruitmentDeadline('');
      return;
    }

    let isCurrent = true;
    getKvClient('group-recruitment-deadline')
      .then((value) => {
        if (isCurrent) setRecruitmentDeadline(value);
      })
      .catch(() => {
        if (isCurrent) setRecruitmentDeadline('');
      });

    return () => {
      isCurrent = false;
    };
  }, [item.is_rolling_admission]);

  if (!isJoinAvailable) {
    console.error(`IgClient: unsupported kind ${kind}`);
    return null;
  }

  const isMember = members.some((m) => getMemberIdentity(m) === me?.id);
  const canEdit =
    !!me &&
    ((typeof me.role === 'number' && me.role >= minExecutiveLevel) || item?.owner === me?.id);
  const isOwner = !!me && item?.owner === me?.id;
  const hasCreated = item?.created_year != null && item?.created_semester != null;
  const websites = Array.isArray(item?.websites) ? item.websites : [];
  const hasSectionBelowDivider = websites.length > 0 || membersVisible;
  const normalizedTagText = sortSigPigTags(item?.tags)
    .map((tag) => String(tag?.text ?? '').trim())
    .filter(Boolean);
  const admissionAvailable = isJoinAvailable(item.status, item.is_rolling_admission);
  const admissionLabel =
    item.is_rolling_admission === 'never'
      ? t('joinNeverLabel')
      : item.is_rolling_admission === 'always' && admissionAvailable
        ? t('joinAlwaysLabel')
        : item.is_rolling_admission === 'during_recruiting' && admissionAvailable
          ? t('joinRecruitingLabel')
          : t('joinUnavailableLabel');
  const admissionClassName =
    item.is_rolling_admission === 'always' && admissionAvailable
      ? styles.admissionAlways
      : item.is_rolling_admission === 'during_recruiting' && admissionAvailable
        ? styles.admissionRecruiting
        : styles.admissionClosed;

  return (
    <div className={styles.detailContainer}>
      <h1 className={styles.title}>{item.title}</h1>
      <p className={styles.info}>
        {hasCreated
          ? t('created', {
              term: t('academicTerm', {
                year: item.created_year!,
                semester: String(item.created_semester),
              }),
            })
          : ''}
        {t('academicTerm', { year: item.year, semester: String(item.semester) })}
        {' · '}
        {t('status', { status: t('statusLabel', { status: item.status }) })}
      </p>
      <p className={styles.description}>{item.description}</p>
      <div className={styles.tagInline}>
        {normalizedTagText.length > 0 ? (
          <span>{normalizedTagText.map((text) => `#${text}`).join(' ')}</span>
        ) : null}
        <span className={styles.admissionInfo}>
          <span
            className={`${styles.admissionDot} ${admissionClassName}`}
            role="img"
            aria-label={admissionLabel}
          />
          <span>
            {admissionLabel}
            {item.is_rolling_admission === 'during_recruiting' && recruitmentDeadline.trim()
              ? ' · ' + t('recruitmentDeadline', { date: recruitmentDeadline })
              : ''}
          </span>
        </span>
      </div>
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
      {hasSectionBelowDivider ? <hr className={styles.divider} /> : null}
      <IgWebsites kind={kind} websites={websites} />
      <IgMembers kind={kind} owner={item?.owner} members={members} visible={membersVisible} />
    </div>
  );
}

function IgWebsites({ kind, websites }: { kind: IgKind; websites: IgWebsite[] }) {
  const t = useTranslations('Ig');
  const headingId = `${kind}-websites-heading`;

  if (!Array.isArray(websites) || websites.length === 0) return null;

  return (
    <section className={styles.websitesSection} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.websitesTitle}>
        {t('websites')}
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
