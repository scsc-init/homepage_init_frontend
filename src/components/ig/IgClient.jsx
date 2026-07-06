'use client';

import SigJoinLeaveButton from '@/app/sig/[id]/SigJoinLeaveButton';
import EditSigButton from '@/app/sig/[id]/EditSigButton';
import SigDeleteButton from '@/app/sig/[id]/SigDeleteButton';
import SigMembers from '@/app/sig/[id]/SigMembers';
import SigOwnerHandoverButton from '@/app/sig/[id]/SigOwnerHandoverButton';
import SigContents from '@/app/sig/[id]/SigContents';
import PigJoinLeaveButton from '@/app/pig/[id]/PigJoinLeaveButton';
import EditPigButton from '@/app/pig/[id]/EditPigButton';
import PigDeleteButton from '@/app/pig/[id]/PigDeleteButton';
import PigMembers from '@/app/pig/[id]/PigMembers';
import PigOwnerHandoverButton from '@/app/pig/[id]/PigOwnerHandoverButton';
import PigContents from '@/app/pig/[id]/PigContents';
import { sortSigPigTags } from '@/components/board/SigPigTags';
import {
  is_sigpig_join_available,
  is_pig_join_available,
  minExecutiveLevel,
  SEMESTER_MAP,
} from '@/util/constants';
import { useMe } from '@/util/hooks/useMe';

const DETAIL_CONFIG = {
  sig: {
    label: 'SIG',
    containerClass: 'SigDetailContainer',
    titleClass: 'SigTitle',
    infoClass: 'SigInfo',
    descriptionClass: 'SigDescription',
    tagInlineClass: 'SigTagInline',
    actionRowClass: 'SigActionRow',
    dividerClass: 'SigDivider',
    websitesSectionClass: 'SigWebsitesSection',
    websitesTitleClass: 'SigWebsitesTitle',
    websitesListClass: 'SigWebsitesList',
    websitesItemClass: 'SigWebsitesItem',
    isJoinAvailable: is_sigpig_join_available,
  },
  pig: {
    label: 'PIG',
    containerClass: 'PigDetailContainer',
    titleClass: 'PigTitle',
    infoClass: 'PigInfo',
    descriptionClass: 'PigDescription',
    tagInlineClass: 'PigTagInline',
    actionRowClass: 'PigActionRow',
    dividerClass: 'PigDivider',
    websitesSectionClass: 'PigWebsitesSection',
    websitesTitleClass: 'PigWebsitesTitle',
    websitesListClass: 'PigWebsitesList',
    websitesItemClass: 'PigWebsitesItem',
    isJoinAvailable: is_pig_join_available,
  },
};

export default function IgClient({ kind, item, members, articleContent, itemId }) {
  const { me, isLoading } = useMe();
  const config = DETAIL_CONFIG[kind];

  if (!config) {
    console.error(`IgClient: unsupported kind ${kind}`);
    return null;
  }

  const isMember = members.some((m) => (m?.id ?? m?.user_id) === me?.id);
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
    <div className={config.containerClass}>
      <h1 className={config.titleClass}>{item.title}</h1>
      <p className={config.infoClass}>
        {hasCreated ? `ìµì´ ìì±: ${item.created_year}íëë ${createdSemesterLabel}íê¸° Â· ` : ''}
        {item.year}íëë {semesterLabel}íê¸° Â· ìí: {item.status}
      </p>
      <p className={config.descriptionClass}>{item.description}</p>
      {normalizedTagText.length > 0 ? (
        <div className={config.tagInlineClass}>
          {normalizedTagText.map((text) => `#${text}`).join(' ')}
        </div>
      ) : null}
      {!isLoading && me ? (
        <div className={config.actionRowClass}>
          {config.isJoinAvailable(item.status, item.is_rolling_admission)
            ? renderJoinLeaveButton(kind, itemId, isMember)
            : null}
          {renderEditButton(kind, itemId, canEdit)}
          {isOwner ? renderHandoverButton(kind, itemId, members, item.owner) : null}
          {renderDeleteButton(kind, itemId, canEdit, isOwner)}
        </div>
      ) : null}
      <hr className={config.dividerClass} />
      {renderContents(kind, articleContent)}
      <hr className={config.dividerClass} />
      <IgWebsites kind={kind} websites={websites} />
      {renderMembers(kind, item?.owner, members)}
    </div>
  );
}

function renderJoinLeaveButton(kind, itemId, isMember) {
  return kind === 'sig' ? (
    <SigJoinLeaveButton sigId={itemId} initialIsMember={isMember} />
  ) : (
    <PigJoinLeaveButton pigId={itemId} initialIsMember={isMember} />
  );
}

function renderEditButton(kind, itemId, canEdit) {
  return kind === 'sig' ? (
    <EditSigButton sigId={itemId} canEdit={canEdit} />
  ) : (
    <EditPigButton pigId={itemId} canEdit={canEdit} />
  );
}

function renderHandoverButton(kind, itemId, members, owner) {
  return kind === 'sig' ? (
    <SigOwnerHandoverButton sigId={itemId} members={members} owner={owner} />
  ) : (
    <PigOwnerHandoverButton pigId={itemId} members={members} owner={owner} />
  );
}

function renderDeleteButton(kind, itemId, canEdit, isOwner) {
  return kind === 'sig' ? (
    <SigDeleteButton sigId={itemId} canDelete={canEdit} isOwner={isOwner} />
  ) : (
    <PigDeleteButton pigId={itemId} canDelete={canEdit} isOwner={isOwner} />
  );
}

function renderContents(kind, content) {
  return kind === 'sig' ? <SigContents content={content} /> : <PigContents content={content} />;
}

function renderMembers(kind, owner, members) {
  return kind === 'sig' ? (
    <SigMembers owner={owner} members={members} />
  ) : (
    <PigMembers owner={owner} members={members} />
  );
}

function IgWebsites({ kind, websites }) {
  const config = DETAIL_CONFIG[kind];
  const headingId = `${kind}-websites-heading`;

  if (!Array.isArray(websites) || websites.length === 0) return null;

  return (
    <section className={config.websitesSectionClass} aria-labelledby={headingId}>
      <h2 id={headingId} className={config.websitesTitleClass}>
        ê´ë ¨ ì¹ì¬ì´í¸
      </h2>
      <ul className={config.websitesListClass}>
        {websites.map((website, idx) => {
          const label = website?.label?.trim() || website?.url;
          const key = website?.id ?? `${website?.url}-${idx}`;
          return (
            <li key={key} className={config.websitesItemClass}>
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
