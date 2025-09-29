export default function PigMembers({ owner, members }) {
  const rawList = Array.isArray(members) ? members : [];
  const ownerIndex = !!owner ? rawList.findIndex(m => m.id === owner) : -1
  const list = ownerIndex === -1
    ? rawList
    : [rawList[ownerIndex], ...rawList.slice(0, ownerIndex), ...rawList.slice(ownerIndex + 1)];
  const count = list.length;

  return (
    <section className="PigMembersSection" aria-labelledby="pig-members-heading">
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
            m.id === owner ? (
              <li key={m.id} className="PigMemberOwner">
                {m.name}
              </li>
            ) : (
              <li key={m.id} className="PigMemberChip">
                {m.name}
              </li>
              )
          ))}
        </ul>
      )}
    </section>
  );
}
