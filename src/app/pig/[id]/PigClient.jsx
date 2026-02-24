'use client';

import PigJoinLeaveButton from './PigJoinLeaveButton';
import EditPigButton from './EditPigButton';
import PigDeleteButton from './PigDeleteButton';
import PigMembers from './PigMembers';
import PigOwnerHandoverButton from './PigOwnerHandoverButton';
import PigContents from './PigContents';
import { is_pig_join_available, minExecutiveLevel, SEMESTER_MAP } from '@/util/constants';

export default function PigClient({ pig, members, articleContent, me, pigId }) {
  const isMember = members.some((m) => (m?.id ?? m?.user_id) === me?.id);
  const canEdit =
    !!me &&
    ((typeof me.role === 'number' && me.role >= minExecutiveLevel) || pig?.owner === me?.id);
  const isOwner = !!me && pig?.owner === me?.id;
  const semesterLabel = SEMESTER_MAP[Number(pig?.semester)] ?? `${pig?.semester}`;
  const createdSemesterLabel =
    SEMESTER_MAP[Number(pig?.created_semester)] ?? `${pig?.created_semester}`;
  const hasCreated = pig?.created_year != null && pig?.created_semester != null;
  const websites = Array.isArray(pig?.websites) ? pig.websites : [];

  return (
    <div className="PigDetailContainer">
      <h1 className="PigTitle">{pig.title}</h1>
      <p className="PigInfo">
        {hasCreated
          ? `최초 생성: ${pig.created_year}학년도 ${createdSemesterLabel}학기 · `
          : ''}
        {pig.year}학년도 {semesterLabel}학기 · 상태: {pig.status}
      </p>
      <p className="PigDescription">{pig.description}</p>
      <div className="PigActionRow">
        {is_pig_join_available(pig.status, pig.is_rolling_admission) && (
          <PigJoinLeaveButton pigId={pigId} initialIsMember={isMember} />
        )}
        <EditPigButton pigId={pigId} canEdit={canEdit} />
        {isOwner ? (
          <PigOwnerHandoverButton pigId={pigId} members={members} owner={pig.owner} />
        ) : null}
        <PigDeleteButton pigId={pigId} canDelete={canEdit} isOwner={isOwner} />
      </div>
      <hr className="PigDivider" />
      <PigContents content={articleContent} />
      <hr />
      <PigWebsites websites={websites} />
      <PigMembers owner={pig?.owner} members={members} />
    </div>
  );
}

function PigWebsites({ websites }) {
  if (!Array.isArray(websites) || websites.length === 0) return null;

  return (
    <section className="PigWebsitesSection" aria-labelledby="pig-websites-heading">
      <h2 id="pig-websites-heading" className="PigWebsitesTitle">
        관련 웹사이트
      </h2>
      <ul className="PigWebsitesList">
        {websites.map((website, idx) => {
          const label = website?.label?.trim() || website?.url;
          const key = website?.id ?? `${website?.url}-${idx}`;
          return (
            <li key={key} className="PigWebsitesItem">
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
