"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "./page.css";
import * as validator from "./validator";
import { isSkipEmailCheck } from "@/app/env/check.js"
import { create } from "domain";

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
  const studentIdNumberRef = useRef(null);
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const checkProfile = async () => {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        router.push("/about/welcome");
        return;
      }
    };

    checkProfile();
  }, [router]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

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

      const { email, name: rawName, picture: profilePictureUrl } = payload;
      setForm((prev) => ({ ...prev, email, name: cleanName, profile_picture_url: profilePictureUrl }));

      const cleanName = rawName
        ?.replace(/^[-\s\u00AD\u2010-\u2015]+/, "")
        .split("/")[0]
        ?.trim();
      if (!email || !cleanName) return;

      if (!(await isSkipEmailCheck()) && !validator.email(email)) {
        console.log(email);
        console.log(validator.email(email))
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
      } else {
        if (res.status === 404) {
          setForm((prev) => ({ ...prev, email, name: cleanName }));
          setStage(1);
        } else {
          alert("로그인 중 오류 발생");
        }
      }
    };
  }, []);

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
      console.log(createData);
      router.push('/')
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
              <img src="/main/main-logo.png" alt="Main Logo" className="main-logo" />
              <div className="main-subtitle">
                Seoul National University Computer Study Club
              </div>
            </div>
            <p className="login-description">SNU 구글 계정으로 로그인/회원가입</p>
            <div
              id="g_id_onload"
              data-client_id="876662086445-m79pj1qjg0v7m7efqhqtboe7h0ra4avm.apps.googleusercontent.com"
              data-callback="handleCredentialResponse"
              data-auto_prompt="false"
            ></div>
            <div className="google-signin-button-wrapper">
              <div
                className="g_id_signin"
                data-type="standard"
                data-size="large"
                data-theme="outline"
                data-text="sign_in_with"
                data-shape="rectangular"
                data-logo_alignment="left"
              ></div>
            </div>
          </div>
        )}

        {stage === 1 && (
          <div style={{boxSizing: "border-box", marginTop: "0vh" }}>
            <input value={form.email} disabled style={{width: "100%", boxSizing: "border-box"}}/>
            <p>
              이름: <strong>{form.name}</strong>
            </p>
            <button
              onClick={async () => {
                setStage(2);
              }}
              style={{width: "100%", boxSizing: "border-box"}}
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
                  if (val.length === 4) studentIdNumberRef.current.focus();
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
                  if (val.length === 3) phone2Ref.current.focus();
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
                  if (val.length === 4) phone3Ref.current.focus();
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
                {[...new Set(majors.map((m) => (m.college)))].map((c) => (
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
                {majors.filter((m) => (m.college == college)).map((m) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
