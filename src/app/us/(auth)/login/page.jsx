"use client";

import { useEffect, useRef, useState, useRef as _r } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import "./page.css";
import * as validator from "./validator";
import { isSkipEmailCheck } from "@/app/env/check.js";

const GOOGLE_CLIENT_ID =
  "876662086445-m79pj1qjg0v7m7efqhqtboe7h0ra4avm.apps.googleusercontent.com";

export default function LoginPage() {
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
    profile_picture_url: "",
  });
  const [majors, setMajors] = useState([]);
  const [college, setCollege] = useState("");
  const tokenClientRef = useRef(null);
  const studentIdNumberRef = useRef(null);
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return;
      const r = await fetch(`/api/user/profile`, { headers: { "x-jwt": jwt } });
      if (r.ok) router.push("/about/welcome");
      else localStorage.removeItem("jwt");
    };
    check();
  }, [router]);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = () => {
      tokenClientRef.current = window.google?.accounts?.oauth2?.initTokenClient(
        {
          client_id: GOOGLE_CLIENT_ID,
          scope: "openid email profile",
          prompt: "select_account",
          callback: async (resp) => {
            if (!resp || resp.error || !resp.access_token) {
              await signIn("google", { callbackUrl: "/", redirect: true });
              return;
            }
            const u = await fetch(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              {
                headers: { Authorization: `Bearer ${resp.access_token}` },
              },
            ).then((r) => r.json());

            const email = u.email || "";
            const name = (u.name || "").trim();
            const picture = u.picture || "";

            setForm((p) => ({
              ...p,
              email,
              name,
              profile_picture_url: picture,
            }));

            if (!(await isSkipEmailCheck()) && !validator.email(email)) {
              alert("snu.ac.kr 이메일만 허용됩니다.");
              return;
            }

            const loginRes = await fetch(`/api/user/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });

            if (loginRes.ok) {
              const { jwt } = await loginRes.json();
              localStorage.setItem("jwt", jwt);
              window.location.href = "/";
            } else if (loginRes.status === 404) {
              setStage(1);
            } else {
              alert("로그인 중 오류 발생");
            }
          },
        },
      );
    };
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    if (stage !== 4) return;
    const f = async () => {
      const r = await fetch(`/api/majors`);
      setMajors(await r.json());
    };
    f();
  }, [stage]);

  const openPopup = async () => {
    try {
      if (tokenClientRef.current)
        tokenClientRef.current.requestAccessToken({ prompt: "select_account" });
      else await signIn("google", { callbackUrl: "/", redirect: true });
    } catch {
      await signIn("google", { callbackUrl: "/", redirect: true });
    }
  };

  const handleSubmit = async () => {
    const student_id = `${form.student_id_year}${form.student_id_number}`;
    const phone = `${form.phone1}${form.phone2}${form.phone3}`;

    const createRes = await fetch(`/api/user/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        name: form.name,
        student_id,
        phone,
        major_id: Number(form.major_id),
        status: "pending",
        profile_picture: form.profile_picture_url,
        profile_picture_is_url: true,
      }),
    });

    if (createRes.status !== 201) {
      const data = await createRes.json();
      alert(`유저 생성 실패: ${data.detail}`);
      router.push("/");
      return;
    }

    const loginRes = await fetch(`/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });

    const { jwt } = await loginRes.json();
    localStorage.setItem("jwt", jwt);
    window.location.replace("/about/welcome");
  };

  return (
    <div id="GoogleSignupContainer">
      <div className="GoogleSignupCard">
        {stage === 0 && (
          <div>
            <div className="main-logo-wrapper">
              <img
                src="/main/main-logo.png"
                alt="Main Logo"
                className="main-logo logo"
              />
              <div className="main-subtitle">
                Seoul National University Computer Study Club
              </div>
            </div>
            <p className="login-description">
              SNU 구글 계정으로 로그인/회원가입
            </p>
            <div className="google-signin-button-wrapper">
              <button
                type="button"
                className="GoogleLoginBtn"
                onClick={openPopup}
              >
                <span className="GoogleIcon" aria-hidden="true">
                  <svg viewBox="0 0 48 48">
                    <path d="M24 9.5c3.7 0 7 1.3 9.6 3.8l6.4-6.4C36.3 3 30.6 1 24 1 14.7 1 6.7 6.3 2.9 14.1l7.9 6.1C12.4 14.9 17.7 9.5 24 9.5z" />
                    <path d="M46.5 24c0-1.6-.2-3.1-.5-4.5H24v9h12.6c-.5 2.7-2.1 5-4.5 6.5l7.1 5.5C43.9 36.9 46.5 30.9 46.5 24z" />
                    <path d="M10.8 28.2c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C1.1 15.6 0 19.6 0 23.5 0 27.4 1.1 31.4 2.9 34.3l7.9-6.1z" />
                    <path d="M24 47c6.5 0 12.1-2.1 16.1-5.8l-7.1-5.5c-2 1.3-4.6 2.1-9 2.1-6.3 0-11.6-5.4-13.2-10.2l-7.9 6.1C6.7 41.7 14.7 47 24 47z" />
                  </svg>
                </span>
                <span className="GoogleLoginText">Google 계정으로 로그인</span>
              </button>
            </div>
          </div>
        )}

        {stage === 1 && (
          <div style={{ boxSizing: "border-box", marginTop: "10vh" }}>
            <input
              value={form.email}
              disabled
              style={{ width: "100%", boxSizing: "border-box" }}
            />
            <p>
              이름: <strong>{form.name}</strong>
            </p>
            <button
              onClick={() => setStage(2)}
              style={{ width: "100%", boxSizing: "border-box" }}
            >
              다음
            </button>
          </div>
        )}

        {stage === 2 && (
          <div style={{ marginTop: "0vh" }}>
            <p>학번 입력</p>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                value={form.student_id_year}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm({ ...form, student_id_year: v });
                  if (v.length === 4) studentIdNumberRef.current.focus();
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
          </div>
        )}

        {stage === 3 && (
          <div style={{ marginTop: "0vh" }}>
            <p>전화번호 입력</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                value={form.phone1}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm({ ...form, phone1: v });
                  if (v.length === 3) phone2Ref.current.focus();
                }}
                maxLength={3}
                placeholder="010"
              />
              <input
                ref={phone2Ref}
                value={form.phone2}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm({ ...form, phone2: v });
                  if (v.length === 4) phone3Ref.current.focus();
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
          </div>
        )}

        {stage === 4 && (
          <div style={{ marginTop: "0vh" }}>
            <p>단과대학 소속 입력</p>
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
                  .filter((m) => m.college == college)
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
                }
                if (!form.major_id) {
                  alert("학과/학부를 선택하세요.");
                  return;
                }
                handleSubmit();
              }}
            >
              가입하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
