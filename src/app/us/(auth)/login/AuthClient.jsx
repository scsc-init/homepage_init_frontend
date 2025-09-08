"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import "./page.css";
import * as validator from "./validator";

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

function log(event, data = {}) {
  try {
    const body = JSON.stringify({ event, data, ts: new Date().toISOString() });
    const url = "/api/log";
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }
    fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {}
}

async function onAuthFail() {
  try {
    localStorage.removeItem("jwt");
  } catch {}
  try {
    await signOut({ redirect: false });
  } catch {}
}

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [stage, setStage] = useState(0);
  const [inAppWarning, setInAppWarning] = useState(false);
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
  const [authLoading, setAuthLoading] = useState(false);
  const [signupBusy, setSignupBusy] = useState(false);

  useEffect(() => {
    log("page_view", {
      path: typeof window !== "undefined" ? window.location.pathname : "",
      search: typeof window !== "undefined" ? window.location.search : "",
    });
  }, []);

  useEffect(() => {
    let isInAppBrowser = false;
    let inAppBrowserName = "";
    const ua = navigator.userAgent.toLowerCase();
    for (const [key, name] of Object.entries(IN_APP_BROWSER_NAMES)) {
      const re = new RegExp(`\\b${key}\\b`);
      if (re.test(ua)) {
        isInAppBrowser = true;
        inAppBrowserName = name;
        break;
      }
    }
    if (isInAppBrowser) {
      log("inapp_warning_shown", { name: inAppBrowserName });
      alert(
        `${inAppBrowserName} 인앱 브라우저에서는 로그인이 실패할 수 있습니다. 외부 브라우저를 이용해주세요.`,
      );
      setInAppWarning(true);
    }
  }, []);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;
    const checkProfile = async () => {
      try {
        const resUser = await fetch(`/api/user/profile`, {
          headers: { "x-jwt": jwt },
        });
        if (resUser.status !== 200) {
          log("auto_login_profile_check_failed", { status: resUser.status });
          await onAuthFail();
          return;
        }
        log("auto_login_redirect", { to: "/about/welcome" });
        router.push("/about/welcome");
      } catch (e) {
        log("auto_login_profile_check_error", { error: String(e) });
      }
    };
    checkProfile();
  }, [router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.loginError) {
      log("login_error", { source: "session_flag" });
      return;
    }
    if (session?.signupRequired) {
      const email = (session?.user?.email || "").toLowerCase();
      const cName = cleanName(session?.user?.name || "");
      const image = session?.user?.image || "";
      setForm((prev) => ({
        ...prev,
        email,
        name: cName,
        profile_picture_url: image,
      }));
      setStage(1);
      log("signup_required", { email });
      return;
    }
    if (session?.appJwt) {
      (async () => {
        try {
          localStorage.setItem("jwt", session.appJwt);
        } catch {}
        try {
          await signOut({ redirect: false });
        } catch {}
        log("redirect", { to: "/" });
        window.location.replace("/");
      })();
      return;
    }
    const hasJwt = !!localStorage.getItem("jwt");
    if (!hasJwt) {
      (async () => {
        try {
          await signOut({ redirect: false });
        } catch {}
        log("cleared_session_due_to_missing_jwt");
      })();
    }
  }, [status, session]);

  useEffect(() => {
    if (stage !== 4) return;
    const fetchMajors = async () => {
      try {
        const res = await fetch(`/api/majors`);
        const data = await res.json();
        setMajors(data);
        log("majors_loaded", { count: Array.isArray(data) ? data.length : 0 });
      } catch (e) {
        log("majors_load_failed", { error: String(e) });
      }
    };
    fetchMajors();
  }, [stage]);

  const handleSubmit = async () => {
    log("signup_submit_start");
    const student_id = `${form.student_id_year}${form.student_id_number}`;
    const phone = `${form.phone1}${form.phone2}${form.phone3}`;
    const email = String(form.email || "").toLowerCase();
    const createRes = await fetch(`/api/user/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
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
      log("signup_create_failed", {
        status: createRes.status,
        detail: createData?.detail || null,
      });
      alert(`유저 생성 실패: ${createData.detail}`);
      router.push("/");
      return;
    }
    log("signup_create_success");
    const loginRes = await fetch(`/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const { jwt } = await loginRes.json();
    try {
      localStorage.setItem("jwt", jwt);
      log("stored_app_jwt_after_signup");
    } catch {
      log("store_jwt_failed_after_signup");
    }
    log("redirect", { to: "/about/welcome" });
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
                onClick={() => {
                  if (authLoading) return;
                  setAuthLoading(true);
                  log("click_login_button", { provider: "google" });
                  signIn(
                    "google",
                    { callbackUrl: "/us/login" },
                    { prompt: "select_account" },
                  );
                }}
                disabled={inAppWarning || authLoading}
                aria-disabled={inAppWarning || authLoading}
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
              {inAppWarning && (
                <p className="InAppWarning">
                  인앱 브라우저에서는 인증이 차단될 수 있어요. 외부 브라우저로
                  다시 열어주세요.
                </p>
              )}
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
                log("click_stage1_next");
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
                log("click_stage2_next_attempt", { sid_length: sid.length });
                validator.studentID(sid, (ok) => {
                  if (ok) {
                    log("stage2_valid");
                    setStage(3);
                  } else {
                    log("stage2_invalid");
                    alert("올바른 학번 형식이 아닙니다.");
                  }
                });
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
                log("click_stage3_next_attempt", {
                  phone_length: phone.length,
                });
                validator.phoneNumber(phone, (ok) => {
                  if (ok) {
                    log("stage3_valid");
                    setStage(4);
                  } else {
                    log("stage3_invalid");
                    alert("전화번호 형식이 올바르지 않습니다.");
                  }
                });
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

            <p className="PolicyLink agree">
              회원 가입 시{" "}
              <a
                href="https://github.com/scsc-init/homepage_init/blob/master/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                개인정보 처리방침
              </a>
              에 동의합니다.
            </p>
            <button
              type="button"
              className={`SignupBtn ${signupBusy ? "is-disabled" : ""}`}
              onClick={async () => {
                if (signupBusy) return;
                setSignupBusy(true);
                if (!college) {
                  log("stage4_missing_college");
                  alert("단과대학을 선택하세요.");
                  setSignupBusy(false);
                  return;
                }
                if (!form.major_id) {
                  log("stage4_missing_major");
                  alert("학과/학부를 선택하세요.");
                  setSignupBusy(false);
                  return;
                }
                log("click_signup_button", {
                  college,
                  major_id: form.major_id,
                });
                await handleSubmit();
              }}
              disabled={signupBusy}
              aria-disabled={signupBusy}
            >
              가입하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
