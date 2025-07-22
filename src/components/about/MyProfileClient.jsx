"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  if (!user) return <p className="p-6">불러오는 중...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">내 정보</h1>
      <ul className="space-y-2">
        <li>이메일: {user.email}</li>
        <li>이름: {user.name}</li>
        <li>전화번호: {user.phone}</li>
        <li>학번: {user.student_id}</li>
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
      </div>
    </div>
  );
}
