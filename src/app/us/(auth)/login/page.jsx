"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./page.css";
import { getBaseUrl } from "@/util/getBaseUrl";
import * as validator from "./validator";
import { getApiSecret } from "@/util/getApiSecret";

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
  });
  const [majors, setMajors] = useState([]);
  const studentIdNumberRef = useRef(null);
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

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

      const { email, name: rawName } = payload;
      const cleanName = rawName
        ?.replace(/^[-\s\u00AD\u2010-\u2015]+/, "")
        .split("/")[0]
        ?.trim();
      if (!email || !cleanName) return;

      try {
        const res = await axios.post(
          `${getBaseUrl()}/api/user/login`,
          { email },
          {
            headers: { "x-api-secret": getApiSecret() },
          },
        );
        const { jwt } = res.data;
        localStorage.setItem("jwt", jwt);
        window.location.href = "/";
      } catch (err) {
        if (err.response?.status === 404) {
          setForm((prev) => ({ ...prev, email, name: cleanName }));
          setStage(1);
        } else {
          alert("로그인 중 오류 발생");
        }
      }
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${getBaseUrl()}/api/majors`, {
        headers: { "x-api-secret": getApiSecret() },
      })
      .then((res) => setMajors(res.data));
  }, []);

  const handleSubmit = async () => {
    const student_id = `${form.student_id_year}${form.student_id_number}`;
    const phone = `${form.phone1}${form.phone2}${form.phone3}`;

    await axios.post(
      `${getBaseUrl()}/api/user/create`,
      {
        email: form.email,
        name: form.name,
        student_id,
        phone,
        major_id: Number(form.major_id),
        status: "pending",
      },
      {
        headers: { "x-api-secret": getApiSecret() },
      },
    );

    const loginRes = await axios.post(
      `${getBaseUrl()}/api/user/login`,
      {
        email: form.email,
      },
      {
        headers: { "x-api-secret": getApiSecret() },
      },
    );

    const { jwt } = loginRes.data;
    localStorage.setItem("jwt", jwt);
    window.location.href = "/";
  };

  return (
    <div id="GoogleSignupContainer">
      <div className="GoogleSignupCard">
        {stage === 0 && (
          <div>
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
              data-text="sign_in_with"
              data-shape="rectangular"
              data-logo_alignment="left"
            ></div>
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
          </>
        )}

        {stage === 4 && (
          <>
            <select
              onChange={(e) => setForm({ ...form, major_id: e.target.value })}
              value={form.major_id}
            >
              <option value="">전공 선택</option>
              {majors.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.college} - {m.major_name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (!form.major_id) {
                  alert("전공을 선택하세요.");
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
