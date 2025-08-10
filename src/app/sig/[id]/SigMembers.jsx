export default function SigMembers({ members }) {
  const list = Array.isArray(members) ? members : [];
  const count = list.length;

  return (
    <section
      className="SigMembersSection"
      aria-labelledby="sig-members-heading"
    >
      <div className="SigMembersHeader">
        <h2 id="sig-members-heading" className="SigMembersTitle">
          시그 인원
        </h2>
        <span className="SigMembersCount">{count}명</span>
      </div>

      {count === 0 ? (
        <div className="SigMembersEmpty">가입한 인원이 없습니다.</div>
      ) : (
        <ul className="SigMemberList">
          {list.map((m) => (
            <li key={m.id} className="SigMemberChip">
              {m.name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
