"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PigMembers({ pigId }) {
  const [members, setMembers] = useState([]);
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
        const membersData = await membersRes.json();
        setMembers(membersData.map((m) => m.user))
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
      {members.length === 0 ? (
        <div>로딩 중...</div>
      ) : (
        members.map((m) => <div key={m.id}>{m.name}</div>)
      )}
    </div>
  );
}
