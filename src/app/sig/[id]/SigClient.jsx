'use client';

import SigJoinLeaveButton from './SigJoinLeaveButton';
import EditSigButton from './EditSigButton';
import SigDeleteButton from './SigDeleteButton';
import SigMembers from './SigMembers';
import SigOwnerHandoverButton from './SigOwnerHandoverButton';
import SigContents from './SigContents';
import { is_sigpig_join_available, minExecutiveLevel, SEMESTER_MAP } from '@/util/constants';
import { useMe } from '@/util/hooks/useMe';

export default function SigClient({ sig, members, articleContent, sigId }) {
  const { me, isLoading } = useMe();
  const isMember = members.some((m) => (m?.id ?? m?.user_id) === me?.id);
  const canEdit =
    !!me &&
    ((typeof me.role === 'number' && me.role >= minExecutiveLevel) || sig?.owner === me?.id);
  const isOwner = !!me && sig?.owner === me?.id;
  const semesterLabel = SEMESTER_MAP[Number(sig?.semester)] ?? `${sig?.semester}`;
  const createdSemesterLabel =
    SEMESTER_MAP[Number(sig?.created_semester)] ?? `${sig?.created_semester}`;
  const hasCreated = sig?.created_year != null && sig?.created_semester != null;
  const websites = Array.isArray(sig?.websites) ? sig.websites : [];

  const normalizedTagText = Array.isArray(sig?.tags)
    ? [...sig.tags]
        .sort((a, b) => {
          if (!!a?.is_major !== !!b?.is_major) return a?.is_major ? -1 : 1;
          return String(a?.text ?? '').localeCompare(String(b?.text ?? ''), 'ko');
        })
        .map((tag) => String(tag?.text ?? '').trim())
        .filter(Boolean)
    : [];

  return (
    <div className="SigDetailContainer">
      <h1 className="SigTitle">{sig.title}</h1>
      <p className="SigInfo">
        {hasCreated
          ? `최초 생성: ${sig.created_year}학년도 ${createdSemesterLabel}학기 · `
          : ''}
        {sig.year}학년도 {semesterLabel}학기 · 상태: {sig.status}
      </p>
      <p className="SigDescription">{sig.description}</p>
      {normalizedTagText.length > 0 && (
        <div className="SigTagInline">
          {normalizedTagText.map((text) => `#${text}`).join(' ')}
        </div>
      )}
      {!isLoading && me ? (
        <div className="SigActionRow">
          {is_sigpig_join_available(sig.status, sig.is_rolling_admission) && (
            <SigJoinLeaveButton sigId={sigId} initialIsMember={isMember} />
          )}
          <EditSigButton sigId={sigId} canEdit={canEdit} />
          {isOwner ? (
            <SigOwnerHandoverButton sigId={sigId} members={members} owner={sig.owner} />
          ) : null}
          <SigDeleteButton sigId={sigId} canDelete={canEdit} isOwner={isOwner} />
        </div>
      ) : null}
      <hr className="SigDivider" />
      <SigContents content={articleContent} />
      <hr className="SigDivider" />
      <SigWebsites websites={websites} />
      <SigMembers owner={sig?.owner} members={members} />
    </div>
  );
}

function SigWebsites({ websites }) {
  if (!Array.isArray(websites) || websites.length === 0) return null;

  return (
    <section className="SigWebsitesSection" aria-labelledby="sig-websites-heading">
      <h2 id="sig-websites-heading" className="SigWebsitesTitle">
        관련 웹사이트
      </h2>
      <ul className="SigWebsitesList">
        {websites.map((website, idx) => {
          const label = website?.label?.trim() || website?.url;
          const key = website?.id ?? `${website?.url}-${idx}`;
          return (
            <li key={key} className="SigWebsitesItem">
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
