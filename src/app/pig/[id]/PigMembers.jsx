"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PigMembers({ pigId }) {
  const [memberNames, setMemberNames] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.push("/us/login");
    }

    const fetchMembers = async () => {
      try {
        const membersRes = await fetch(`/api/pig/${pigId}/members`, {
          headers: { "x-jwt": jwt },
        });
        if (!membersRes.ok) {
          alert("피그 인원 불러오기 실패");
          router.push('/pig');
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
        alert(`피그 인원 불러오기 중 오류: ${e}`);
        router.push('/pig');
      }
    };
    fetchMembers();
  }, [router, pigId]);

  return (
    <div>
      <h2>피그 인원</h2>
      {memberNames.length === 0 ? (
        <div>로딩 중...</div>
      ) : (
        memberNames.map((name, i) => <div key={i}>{name}</div>)
      )}
    </div>
  );
}
