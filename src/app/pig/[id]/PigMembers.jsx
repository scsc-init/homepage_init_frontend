export default function PigMembers({ members }) {
  const list = Array.isArray(members) ? members : [];
  const count = list.length;

  return (
    <section
      className="PigMembersSection"
      aria-labelledby="pig-members-heading"
    >
      <div className="PigMembersHeader">
        <h2 id="pig-members-heading" className="PigMembersTitle">
          피그 인원
        </h2>
        <span className="PigMembersCount">{count}명</span>
      </div>

      {count === 0 ? (
        <div className="PigMembersEmpty">가입한 인원이 없습니다.</div>
      ) : (
        <ul className="PigMemberList">
          {list.map((m) => (
            <li key={m.id} className="PigMemberChip">
              {m.name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
