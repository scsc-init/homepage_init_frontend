"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "./page.css";
import * as validator from "./validator";
import { isSkipEmailCheck } from "@/app/env/check.js";

const IN_APP_BROWSER_NAMES = {
  kakaotalk: "카카오톡",
  everytimeapp: "에브리타임",
  instagram: "인스타그램",
  line: "라인",
};

function cleanName(raw) {
  if (!raw) return "";
  return raw
    .normalize("NFC")
    .replace(/^[\s\-\u00AD\u2010-\u2015]+/u, "")
    .split("/")[0]
    .replace(/\s+/g, " ")
    .trim();
}

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
  const hiddenBtnRef = useRef(null);
  const studentIdNumberRef = useRef(null);
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    var isInAppBrowser = false;
    var inAppBrowserName = '';
    for (const [key, name] of Object.entries(IN_APP_BROWSER_NAMES)) {
      if (navigator.userAgent.toLowerCase().match(key)) {isInAppBrowser = true; inAppBrowserName = name; break;}
    }
    if (isInAppBrowser) {alert(`${inAppBrowserName} 인앱 브라우저에서는 로그인이 실패할 수 있습니다. 외부 브라우저를 이용해주세요.`); window.location.href = '/';}
  }, [])

  useEffect(() => {
    const checkProfile = async () => {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        try {
          const resUser = await fetch(`/api/user/profile`, {
            headers: { "x-jwt": jwt },
          });
          if (resUser.status != 200) {
            localStorage.removeItem("jwt");
            return;
          }
          router.push("/about/welcome");
        } catch {
          return;
        }
      }
    };
    checkProfile();
  }, [router]);

  useEffect(() => {
    window.handleCredentialResponse = async (response) => {
      const { credential } = response;
      const payload = JSON.parse(
        decodeURIComponent(
          escape(
            window.atob(
              credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"),
            ),
          ),
        ),
      );
      const email = payload.email || "";
      const cName = cleanName(payload.name || "");
      const profilePictureUrl = payload.picture || "";
      setForm((prev) => ({
        ...prev,
        email,
        name: cName,
        profile_picture_url: profilePictureUrl,
      }));
      if (!email || !cName) return;
      if (!(await isSkipEmailCheck()) && !validator.email(email)) {
        alert("snu.ac.kr 이메일만 허용됩니다.");
        return;
      }
      const res = await fetch(`/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const { jwt } = await res.json();
        localStorage.setItem("jwt", jwt);
        window.location.href = "/";
      } else if (res.status === 404) {
        setForm((prev) => ({ ...prev, email, name: cName }));
        setStage(1);
      } else {
        alert("로그인 중 오류 발생");
      }
    };

    const init = () => {
      const cid =
        document
          .querySelector('meta[name="google-signin-client_id"]')
          ?.getAttribute("content") ||
        window.__GSI_CID ||
        "";
      if (!cid) return;
      window.google?.accounts?.id?.initialize({
        client_id: cid,
        callback: window.handleCredentialResponse,
        ux_mode: "popup",
      });
      if (hiddenBtnRef.current) {
        window.google?.accounts?.id?.renderButton(hiddenBtnRef.current, {
          type: "standard",
          size: "large",
          theme: "outline",
          text: "sign_in_with",
          shape: "rectangular",
          logo_alignment: "left",
        });
      }
    };

    if (window.google?.accounts?.id) init();
    else {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.defer = true;
      s.onload = init;
      document.body.appendChild(s);
    }
  }, []);

  useEffect(() => {
    if (stage !== 4) return;
    const fetchMajors = async () => {
      const res = await fetch(`/api/majors`);
      setMajors(await res.json());
    };
    fetchMajors();
  }, [stage]);

  const openGooglePopup = () => {
    const el = hiddenBtnRef.current?.querySelector('div[role="button"]');
    if (el) el.click();
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
      const createData = await createRes.json();
      alert(`유저 생성 실패: ${createData.detail}`);
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
                onClick={openGooglePopup}
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
              <div
                ref={hiddenBtnRef}
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 0,
                  height: 0,
                  overflow: "hidden",
                }}
              />
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
              onClick={() => {
                setStage(2);
              }}
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
          </div>
        )}

        {stage === 3 && (
          <div style={{ marginTop: "0vh" }}>
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
