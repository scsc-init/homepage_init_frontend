"use client";

import { useEffect, useState, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./page.css";
import * as validator from "@/components/validator.jsx";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [stage, setStage] = useState(0);
  const [form, setForm] = useState({
    email: "",
    name: "",
    student_id_year: "",
    student_id_number: "",
    phone1: "",
    phone2: "",
    phone3: "",
    major_id: "",
  });
  const [majors, setMajors] = useState([]);
  const [college, setCollege] = useState("");

  const studentIdNumberRef = useRef(null);
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  useEffect(() => {
    const tryLogin = async () => {
      if (!session) return;

      try {
        const res = await fetch("/api/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });

        if (res.ok) {
          const { jwt } = await res.json();
          localStorage.setItem("jwt", jwt);
          window.location.replace("/");
        } else if (res.status === 404) {
          setForm((prev) => ({
            ...prev,
            email: session.user.email,
            name: session.user.name,
          }));
          setStage(1);
        } else {
          alert("로그인 중 오류 발생");
        }
      } catch (err) {
        console.error("로그인 실패:", err);
        alert("로그인 중 네트워크 오류가 발생했습니다.");
      }
    };

    tryLogin();
  }, [session]);

  useEffect(() => {
    if (stage !== 4) return;
    const fetchMajors = async () => {
      const res = await fetch(`/api/majors`);
      setMajors(await res.json());
    };
    fetchMajors();
  }, [stage]);

  const handleSubmit = async () => {
    const student_id = `${form.student_id_year}${form.student_id_number}`;
    const phone = `${form.phone1}${form.phone2}${form.phone3}`;

    await fetch(`/api/user/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        name: form.name,
        student_id,
        phone,
        major_id: Number(form.major_id),
        status: "pending",
      }),
    });

    const loginRes = await fetch(`/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });

    const { jwt } = await loginRes.json();
    localStorage.setItem("jwt", jwt);
    router.push("/");
  };

  return (
    <div id="GoogleSignupContainer">
      <div className="GoogleSignupCard">
        {stage === 0 && (
          <div>
            <button onClick={() => signIn("google")}>
              Google 계정으로 로그인
            </button>
          </div>
        )}

        {stage === 1 && (
          <>
            <input value={form.email} disabled />
            <p>
              이름: <strong>{form.name}</strong>
            </p>
            <button
              onClick={() => {
                validator.email(form.email, (ok) =>
                  ok ? setStage(2) : alert("snu.ac.kr 이메일만 허용됩니다."),
                );
              }}
            >
              다음
            </button>
          </>
        )}

        {stage === 2 && (
          <>
            <p>학번 입력</p>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                value={form.student_id_year}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, student_id_year: val });
                  if (val.length === 4) studentIdNumberRef.current?.focus();
                }}
                maxLength={4}
                placeholder="2025"
              />
              <span style={{ fontSize: "1.25rem" }}>-</span>
              <input
                ref={studentIdNumberRef}
                value={form.student_id_number}
                onChange={(e) =>
                  setForm({ ...form, student_id_number: e.target.value })
                }
                maxLength={5}
                placeholder="10056"
              />
            </div>
            <button
              onClick={() => {
                const sid = `${form.student_id_year}${form.student_id_number}`;
                validator.studentID(sid, (ok) =>
                  ok ? setStage(3) : alert("올바른 학번 형식이 아닙니다."),
                );
              }}
            >
              다음
            </button>
          </>
        )}

        {stage === 3 && (
          <>
            <p>전화번호 입력</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                value={form.phone1}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, phone1: val });
                  if (val.length === 3) phone2Ref.current?.focus();
                }}
                maxLength={3}
                placeholder="010"
              />
              <input
                ref={phone2Ref}
                value={form.phone2}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, phone2: val });
                  if (val.length === 4) phone3Ref.current?.focus();
                }}
                maxLength={4}
                placeholder="1234"
              />
              <input
                ref={phone3Ref}
                value={form.phone3}
                onChange={(e) => setForm({ ...form, phone3: e.target.value })}
                maxLength={4}
                placeholder="5678"
              />
            </div>
            <button
              onClick={() => {
                const phone = `${form.phone1}${form.phone2}${form.phone3}`;
                validator.phoneNumber(phone, (ok) =>
                  ok
                    ? setStage(4)
                    : alert("전화번호 형식이 올바르지 않습니다."),
                );
              }}
            >
              다음
            </button>
          </>
        )}

        {stage === 4 && (
          <>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <select
                onChange={(e) => setCollege(e.target.value)}
                value={college}
              >
                <option value="">단과대학 선택</option>
                {[...new Set(majors.map((m) => m.college))].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                onChange={(e) => setForm({ ...form, major_id: e.target.value })}
                value={form.major_id}
              >
                <option value="">학과/학부 선택</option>
                {majors
                  .filter((m) => m.college === college)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.major_name}
                    </option>
                  ))}
              </select>
            </div>
            <button
              onClick={() => {
                if (!college) {
                  alert("단과대학을 선택하세요.");
                  return;
                } else if (!form.major_id) {
                  alert("학과/학부를 선택하세요.");
                  return;
                }
                handleSubmit();
              }}
            >
              가입하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
