"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as validator from "../login/validator";
import PfpUpdate from "./PfpUpdate";
import "./page.css";

function EditUserInfoClient() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    student_id: "",
    major_id: "",
    profile_picture: "",
  });
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const jwt = localStorage.getItem("jwt");
      const fetchs = [];
      fetchs.push(
        fetch("/api/user/profile", {
          headers: {
            "Content-Type": "application/json",
            "x-jwt": jwt,
          },
        }),
      );
      fetchs.push(fetch("/api/majors"));
      const [resUser, resMajors] = await Promise.all(fetchs);

      if (!resUser.ok) {
        alert("로그인이 필요합니다.");
        router.push("/us/login");
        return;
      }
      const user = await resUser.json();
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        student_id: user.student_id || "",
        major_id: user.major_id?.toString() || "",
        profile_picture: user.profile_picture || "",
      });

      const majorList = await resMajors.json();
      setMajors(majorList);
      setLoading(false);
    };
    fetchData();
  }, [router]);

  const handleSubmit = async () => {
    const { name, phone, student_id, major_id } = form;

    validator.name(name, (ok) => {
      if (!ok) return alert("이름이 올바르지 않습니다.");
    });
    validator.phoneNumber(phone, (ok) => {
      if (!ok) return alert("전화번호 형식이 올바르지 않습니다.");
    });
    validator.studentID(student_id, (ok) => {
      if (!ok) return alert("학번 형식이 올바르지 않습니다.");
    });

    const jwt = localStorage.getItem("jwt");
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-jwt": jwt,
      },
      body: JSON.stringify({
        name,
        phone,
        student_id,
        major_id: Number(major_id),
      }),
    });

    if (res.status === 204) {
      alert("정보가 수정되었습니다.");
      router.push("/about/my-page");
    } else if (res.status === 409) {
      alert("이미 사용 중인 전화번호 또는 학번입니다.");
    } else if (res.status === 422) {
      alert("입력값이 올바르지 않습니다.");
    } else {
      alert("수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDelete = async () => {
    const ok = confirm("정말 휴회원 처리하시겠습니까?");
    if (!ok) return;
    const jwt = localStorage.getItem("jwt");
    const res = await fetch("/api/user/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-jwt": jwt,
      },
    });

    if (res.status === 204) {
      alert("휴회원으로 전환되었습니다.");
      router.push("/about/my-page");
    } else if (res.status === 403) {
      alert(`잘못된 접근입니다: ${(await res.json()).detail}`);
    } else {
      alert("수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (loading) return;

  return (
    <div
      style={{
        maxWidth: "25vw",
        minWidth: "250px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem", marginTop: "1rem" }}>
        내 정보 수정
      </h2>
      <img
        src={
          form.profile_picture ? form.profile_picture : "/main/default-pfp.png"
        }
        alt="Profile"
        className="user-profile-picture"
      />
      <PfpUpdate />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "100px 1fr",
          rowGap: "1rem",
          columnGap: "0.5rem",
          alignItems: "center",
        }}
      >
        <label style={{ whiteSpace: "nowrap" }}>이름</label>
        <input
          type="text"
          value={form.name}
          disabled
          style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
        />

        <label style={{ whiteSpace: "nowrap" }}>전화번호</label>
        <input
          type="text"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="01012345678"
          style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
        />

        <label style={{ whiteSpace: "nowrap" }}>학번</label>
        <input
          type="text"
          value={form.student_id}
          onChange={(e) => setForm({ ...form, student_id: e.target.value })}
          placeholder="202512345"
          style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
        />

        <label style={{ whiteSpace: "nowrap" }}>전공</label>
        <select
          value={form.major_id}
          onChange={(e) => setForm({ ...form, major_id: e.target.value })}
          style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
        >
          <option value="">전공 선택</option>
          {majors.map((m) => (
            <option key={m.id} value={m.id}>
              {m.college} - {m.major_name}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <button onClick={handleDelete} style={{ flex: 1, minWidth: "120px" }}>
          휴회원으로 전환
        </button>
        <button onClick={handleSubmit} style={{ flex: 1, minWidth: "120px" }}>
          저장하기
        </button>
      </div>
    </div>
  );
}

export default function EditUserInfoPage() {
  return (
    <div id="Home">
      <div id="EditUserInfoContainer">
        <EditUserInfoClient />
      </div>
    </div>
  );
}
