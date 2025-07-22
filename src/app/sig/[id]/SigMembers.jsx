"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SigMembers({ sigId }) {
  const [memberNames, setMemberNames] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.push("/us/login");
    }

    const fetchMembers = async () => {
      try {
        const membersRes = await fetch(`/api/sig/${sigId}/members`, {
          headers: { "x-jwt": jwt },
        });
        if (!membersRes.ok) {
          alert("시그 인원 불러오기 실패");
          router.push('/sig');
        }
        const members = await membersRes.json();

        const namePromises = members.map(async (m) => {
            const res = await fetch(`/api/user/${m.user_id}`);
            if (!res.ok) throw new Error("Member fetch failed");
            const user = await res.json();
            return user.name;
        });

        const names = await Promise.all(namePromises);
        setMemberNames(names);
      } catch (e) {
        alert(`시그 인원 불러오기 중 오류: ${e}`);
        router.push('/sig');
      }
    };
    fetchMembers();
  }, [router, sigId]);

  return (
    <div>
      <h2>시그 인원</h2>
      {memberNames.length === 0 ? (
        <div>로딩 중...</div>
      ) : (
        memberNames.map((name, i) => <div key={i}>{name}</div>)
      )}
    </div>
  );
}
