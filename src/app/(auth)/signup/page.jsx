"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Departments from "@/data/departments";
import "./page.css";

export default function GoogleSignupPage() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    student_id_year: "",
    student_id_number: "",
    phone: "",
    major_id: "",
  });

  const [majors, setMajors] = useState([]);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.handleCredentialResponse = async (response) => {
      const { credential } = response;
      try {
        const payload = JSON.parse(
          decodeURIComponent(
            escape(
              window.atob(
                credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"),
              ),
            ),
          ),
        );
        const { email, name: rawName } = payload;

        if (!email || !rawName) {
          alert("Google 계정에서 이메일 또는 이름 정보를 가져올 수 없습니다.");
          return;
        }

        const cleanName = rawName
          .replace(/^[\s\u00AD\-\u2011\u2010\u2012\u2013\u2014\u2015]+/, "") // 이름 앞에 붙는 하이픈, &#173; 등 제거
          .split("/")[0]
          .trim();

        setForm((prev) => ({
          ...prev,
          email,
          name: cleanName,
        }));
        setStage(1);
      } catch (err) {
        console.error("JWT 디코딩 오류:", err);
        alert("Google 응답에서 사용자 정보를 해석할 수 없습니다.");
      }
    };
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/majors", {
        headers: { "x-api-secret": "some-secret-code" },
      })
      .then((res) => setMajors(res.data))
      .catch((err) => console.error("전공 목록 불러오기 실패:", err));
  }, []);

  const validateEmail = (email) => {
    if (typeof email !== "string") return false;
    const domain = email.split("@")[1];
    return domain && domain.endsWith("snu.ac.kr");
  };

  const handleSubmit = async () => {
    const fullID = `${form.student_id_year}${form.student_id_number}`;
    try {
      await axios.post(
        "http://localhost:8080/api/user/create",
        {
          email: form.email,
          name: form.name,
          student_id: fullID,
          phone: form.phone,
          major_id: Number(form.major_id),
          status: "pending",
        },
        {
          headers: {
            "x-api-secret": "some-secret-code",
          },
        },
      );

      const loginRes = await axios.post(
        "http://localhost:8080/api/user/login",
        { email: form.email },
        {
          headers: {
            "x-api-secret": "some-secret-code",
          },
        },
      );

      const { jwt, id } = loginRes.data;

      const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(form.email),
      );
      const hashHex = [...new Uint8Array(hashBuffer)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      localStorage.setItem("jwt", jwt);
      localStorage.setItem("user_id", id);
      localStorage.setItem(
        "user_hash",
        hashHex,
      ); /* 6회차대로 미리 반영했으나, id와 hash는 사용하지 않고 있는 거 같습닏 ㅏ아ㅣㅈㄱ */

      alert("회원가입 완료!");
      window.location.href = "/";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("회원가입 실패 응답:", error.response);
        alert(
          "회원가입 실패: " +
            (error.response?.data?.detail ||
              error.response?.data ||
              "알 수 없는 오류"),
        );
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2>Google 계정으로 회원가입</h2>

      {stage === 0 && (
        <div className="flex flex-col items-center space-y-2">
          <div
            id="g_id_onload"
            data-client_id="832461792138-f6qpb4vn8knpi57a46p9a9ph7qvs92qh.apps.googleusercontent.com"
            data-callback="handleCredentialResponse"
            data-auto_prompt="false"
          ></div>
          <div
            className="g_id_signin"
            data-type="standard"
            data-size="large"
            data-theme="outline"
            data-text="signup_with"
            data-shape="rectangular"
            data-logo_alignment="left"
          ></div>
        </div>
      )}

      {stage === 1 && (
        <>
          <input
            value={form.email}
            disabled
            className="border p-2 w-full bg-gray-100"
          />
          <p className="text-sm text-gray-600 mt-2">
            이름: <strong>{form.name}</strong>
          </p>
          <button
            onClick={() => {
              if (!validateEmail(form.email)) {
                alert("구글 계정 이메일은 @snu.ac.kr 도메인이어야 합니다.");
              } else {
                setStage(2);
              }
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            다음
          </button>
        </>
      )}

      {stage === 2 && (
        <>
          <h2>학번 입력</h2>
          <div className="flex gap-2">
            <input
              value={form.student_id_year || ""}
              onChange={(e) =>
                setForm({ ...form, student_id_year: e.target.value })
              }
              placeholder="2025"
              maxLength={4}
              className="border p-2 w-1/2"
            />
            <span className="self-center">-</span>
            <input
              value={form.student_id_number || ""}
              onChange={(e) =>
                setForm({ ...form, student_id_number: e.target.value })
              }
              placeholder="12345"
              maxLength={5}
              className="border p-2 w-1/2"
            />
          </div>
          <button
            onClick={() => {
              const full = `${form.student_id_year}${form.student_id_number}`;
              const valid = /^[0-9]{9}$/.test(full);
              if (!valid) return alert("학번 형식은 YYYY-XXXXX 입니다.");
              setStage(3);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            다음
          </button>
        </>
      )}

      {stage === 3 && (
        <>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="전화번호 (예: 01012345678)"
            className="border p-2 w-full"
          />
          <button
            onClick={() => {
              const valid = /^010[0-9]{8}$/.test(form.phone);
              if (!valid) return alert("전화번호 형식은 010XXXXXXXX 입니다.");
              setStage(4);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            다음
          </button>
        </>
      )}

      {stage === 4 && (
        <>
          <select
            className="border p-2 w-full"
            onChange={(e) => setForm({ ...form, major_id: e.target.value })}
            value={form.major_id || ""}
          >
            <option value="">전공을 선택하세요</option>
            {majors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.college} - {m.major_name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (!form.major_id) return alert("전공을 선택하세요.");
              handleSubmit();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded mt-2 w-full"
          >
            가입하기
          </button>
        </>
      )}
    </div>
  );
}
