import { useEffect } from "react";

export default function SigMembers({ owner, members }) {
  const rawList = Array.isArray(members) ? members : [];
  const ownerIndex = !!owner ? rawList.findIndex(m => m.id === owner) : -1
  const list = ownerIndex === -1
    ? rawList
    : [rawList[ownerIndex], ...rawList.slice(0, ownerIndex), ...rawList.slice(ownerIndex + 1)];
  const count = list.length;

  useEffect(() => {
    console.log(owner, members)
  }, [owner, members])

  return (
    <section className="SigMembersSection" aria-labelledby="sig-members-heading">
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
            m.id === owner ? (
              <li key={m.id} className="SigMemberOwner">
                {m.name}
              </li>
            ) : (
              <li key={m.id} className="SigMemberChip">
                {m.name}
              </li>
              )
          ))}
        </ul>
      )}
    </section>
  );
}
