'use client';

import SigJoinLeaveButton from './SigJoinLeaveButton';
import EditSigButton from './EditSigButton';
import SigDeleteButton from './SigDeleteButton';
import SigMembers from './SigMembers';
import SigContents from './SigContents';
import { is_sigpig_join_available, minExecutiveLevel, SEMESTER_MAP } from '@/util/constants';

export default function SigClient({ sig, members, articleContent, me, sigId }) {
  const isMember = members.some((m) => (m?.id ?? m?.user_id) === me?.id);
  const canEdit =
    !!me && ((typeof me.role === 'number' && me.role >= minExecutiveLevel) || sig?.owner === me?.id);
  const isOwner = !!me && sig?.owner === me?.id;
  const semesterLabel = SEMESTER_MAP[Number(sig?.semester)] ?? `${sig?.semester}`;

  return (
    <div className="SigDetailContainer">
      <h1 className="SigTitle">{sig.title}</h1>
      <p className="SigInfo">
        {sig.year}학년도 {semesterLabel}학기 · 상태: {sig.status}
      </p>
      <p className="SigDescription">{sig.description}</p>
      <div className="SigActionRow">
        {is_sigpig_join_available(sig.status, sig.is_rolling_admission) && (
          <SigJoinLeaveButton sigId={sigId} initialIsMember={isMember} />
        )}
        <EditSigButton sigId={sigId} canEdit={canEdit} />
        <SigDeleteButton sigId={sigId} canDelete={canEdit} isOwner={isOwner} />
      </div>
      <hr className="SigDivider" />
      <SigContents content={articleContent} />
      <hr />
      <SigMembers owner={sig?.owner} members={members} />
    </div>
  );
}
