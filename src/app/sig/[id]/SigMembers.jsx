"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SigMembers({ sigId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    const fetchMembers = async () => {
      if (!jwt) {
        setLoading(false);
        router.push("/us/login");
        return;
      }

      try {
        const membersRes = await fetch(`/api/sig/${sigId}/members`, {
          headers: { "x-jwt": jwt },
        });
        if (!membersRes.ok) {
          alert("시그 인원 불러오기 실패");
          router.push("/sig");
          return;
        }
        const membersData = await membersRes.json();
        setMembers(membersData.map((m) => m.user));
      } catch (e) {
        alert(`시그 인원 불러오기 중 오류: ${e}`);
        router.push("/sig");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [router, sigId]);

  return (
    <div>
      <h2>시그 인원</h2>
      {loading ? (
        <LoadingSpinner />
      ) : members.length === 0 ? (
        <div>가입한 인원이 없습니다.</div>
      ) : (
        members.map((m) => <div key={m.id}>{m.name}</div>)
      )}
    </div>
  );
}
