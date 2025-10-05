'use client';

import PigJoinLeaveButton from './PigJoinLeaveButton';
import EditPigButton from './EditPigButton';
import PigDeleteButton from './PigDeleteButton';
import PigMembers from './PigMembers';
import PigContents from './PigContents';
import { is_pigpig_join_available, minExecutiveLevel, SEMESTER_MAP } from '@/util/constants';

export default function PigClient({ pig, members, articleContent, me, pigId }) {
  const isMember = members.some((m) => (m?.id ?? m?.user_id) === me?.id);
  const canEdit =
    !!me &&
    ((typeof me.role === 'number' && me.role >= minExecutiveLevel) || pig?.owner === me?.id);
  const isOwner = !!me && pig?.owner === me?.id;
  const semesterLabel = SEMESTER_MAP[Number(pig?.semester)] ?? `${pig?.semester}`;

  return (
    <div className="PigDetailContainer">
      <h1 className="PigTitle">{pig.title}</h1>
      <p className="PigInfo">
        {pig.year}학년도 {semesterLabel}학기 · 상태: {pig.status}
      </p>
      <p className="PigDescription">{pig.description}</p>
      <div className="PigActionRow">
        {is_pigpig_join_available(pig.status, pig.is_rolling_admission) && (
          <PigJoinLeaveButton pigId={pigId} initialIsMember={isMember} />
        )}
        <EditPigButton pigId={pigId} canEdit={canEdit} />
        <PigDeleteButton pigId={pigId} canDelete={canEdit} isOwner={isOwner} />
      </div>
      <hr className="PigDivider" />
      <PigContents content={articleContent} />
      <hr />
      <PigMembers owner={pig?.owner} members={members} />
    </div>
  );
}
