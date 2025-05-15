
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function MyPage() {
  ;
  ;
  
  const [user, setUser] = useState(null);
  const [majors, setMajors] = useState(null);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user/profile", {
        withCredentials: true,
        headers: {
          "x-api-secret": "some-secret-code",
        },
      })
      .then((res) => {
        setUser(res.data);

        return axios.get(`http://localhost:8080/api/major/${res.data.major_id}`, {
          headers: {
            "x-api-secret": "some-secret-code",
          },
        });
      })
      .then((res) => {
        setMajors(res.data);
      })
      .catch((err) => {
        console.error("내 정보 조회 실패:", err);
        if (err.response.status === 401) {
          alert("로그인이 필요합니다.");
          router.push("/login");
        }
      });
  }, []);

  if (!user) return <p className="p-6">불러오는 중...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">내 정보</h1>
      <ul className="space-y-2">
        <li>이메일: {user.email}</li>
        <li>이름: {user.name}</li>
        <li>전화번호: {user.phone}</li>
        <li>학번: {user.student_id}</li>
        <li>전공: {majors ? `${majors.college} - ${majors.major_name}` : "로딩 중..."}</li>
      </ul>

      <button
        onClick={() => router.push("/edit-user-info")}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        정보 수정
      </button>
    </div>
  );

}
