"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const USER_STATUS_MAP = {
  "active": "활동 중(입금 확인 완료)",
  "pending": "회비 미납부",
  "standby": "회비 입금 확인 중",
  "banned": "제명됨"
}

export default function MyProfileClient() {
  const [user, setUser] = useState(null);
  const [majors, setMajors] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.push("/us/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const resUser = await fetch(`/api/user/profile`, {
          headers: { "x-jwt": jwt },
        });
        const userData = await resUser.json();
        setUser(userData);
        const resMajor = await fetch(`/api/major/${userData.major_id}`);
        setMajors(await resMajor.json());
      } catch (e) {
        router.push("/us/login");
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    sessionStorage.clear();
    signOut({ callbackUrl: "/" });
  };

  const handleEnroll = async () => {
    const jwt = localStorage.getItem("jwt");
    const res = await fetch("/api/user/enroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-jwt": jwt,
      },
    });

    if (res.status === 204) {
      alert("등록 되었습니다. 임원진이 입금 확인 후 가입이 완료됩니다.");
    } else if (res.status === 400) {
      alert("이미 등록 처리되었거나 제명된 회원입니다.");
    } else {
      alert("등록에 실패하였습니다. 다시 시도해주세요.");
    }
  };

  if (!user) return <p className="p-6">불러오는 중...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">내 정보</h1>
      <ul className="space-y-2">
        <li>이메일: {user.email}</li>
        <li>이름: {user.name}</li>
        <li>전화번호: {user.phone}</li>
        <li>학번: {user.student_id}</li>
        <li>상태: {USER_STATUS_MAP[user.status]}</li>
        <li>
          전공:{" "}
          {majors ? `${majors.college} - ${majors.major_name}` : "로딩 중..."}
        </li>
      </ul>

      <div className="mt-6 space-y-3">
        <button
          onClick={() => router.push("/us/edit-user-info")}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded"
        >
          정보 수정
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-gray-300 text-black px-4 py-2 rounded"
        >
          로그아웃
        </button>
        <button
          onClick={handleEnroll}
          className="w-full bg-gray-300 text-black px-4 py-2 rounded"
        >
          입금 등록
        </button>
      </div>
    </div>
  );
}
