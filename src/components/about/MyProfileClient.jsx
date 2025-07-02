"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

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

    axios
      .get(`${getBaseUrl()}/api/user/profile`, {
        headers: {
          "x-jwt": jwt,
          "x-api-secret": getApiSecret(),
        },
      })
      .then((res) => {
        setUser(res.data);
        return axios.get(`${getBaseUrl()}/api/major/${res.data.major_id}`, {
          headers: {
            "x-api-secret": getApiSecret(),
          },
        });
      })
      .then((res) => setMajors(res.data))
      .catch(() => router.push("/us/login"));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    router.push("/");
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
          onClick={() => router.push("/edit-user-info")}
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
