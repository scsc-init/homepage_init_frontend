"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import "./myProfile.css";

const USER_STATUS_MAP = {
  active: "활동 중(입금 확인 완료)",
  pending: "회비 미납부",
  standby: "회비 입금 확인 중",
  banned: "제명됨",
};

const USER_ROLE_MAP = {
  0: "최저권한",
  100: "휴회원",
  200: "준회원",
  300: "정회원",
  400: "졸업생",
  500: "운영진",
  1000: "회장",
};

async function onAuthFail() {
  try {
    localStorage.removeItem("jwt");
  } catch {}
  try {
    sessionStorage.clear();
  } catch {}
  try {
    await signOut({ redirect: false });
  } catch {}
}

export default function MyProfileClient() {
  const [user, setUser] = useState(null);
  const [majors, setMajors] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      onAuthFail().finally(() => router.push("/us/login"));
      return;
    }

    const fetchProfile = async () => {
      try {
        const resUser = await fetch(`/api/user/profile`, {
          headers: { "x-jwt": jwt },
        });
        if (resUser.status != 200) {
          await onAuthFail();
          router.push("/us/login");
          return;
        }
        const userData = await resUser.json();
        setUser(userData);
        const resMajor = await fetch(`/api/major/${userData.major_id}`);
        setMajors(await resMajor.json());
      } catch (e) {
        await onAuthFail();
        router.push("/us/login");
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("jwt");
    } catch {}
    try {
      sessionStorage.clear();
    } catch {}
    signOut({ callbackUrl: "/" });
  };

  const handleEnroll = async () => {
    const jwt = localStorage.getItem("jwt");
    const res = await fetch("/api/user/enroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-jwt": jwt,
      },
    });

    if (res.status === 204) {
      alert("등록 되었습니다. 임원진이 입금 확인 후 가입이 완료됩니다.");
    } else if (res.status === 400) {
      alert("이미 등록 처리되었거나 제명된 회원입니다.");
    } else if (res.status === 401) {
      await onAuthFail();
      router.push("/us/login");
    } else {
      alert("등록에 실패하였습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <div className="main-logo-wrapper">
        <p className="main-logo-description">My Page</p>
        <img
          src="/main/main-logo.png"
          alt="Main Logo"
          className="main-logo logo"
        />
      </div>
      <div className="user-profile-wrapper">
        {user ? (
          <img
            src={
              user.profile_picture
                ? user.profile_picture
                : "/main/default-pfp.png"
            }
            alt="Profile"
            className="user-profile-picture"
          />
        ) : (
          <img alt="" height={"50px"} src="//:0"></img>
        )}
        <div className="user-name-container">
          <div className="user-name">
            {user ? user.name : ""}{" "}
            {user ? "[" + USER_ROLE_MAP[user.role] + "]" : ""}
          </div>
        </div>
      </div>
      <div class="main-container">
        <div class="user-info-container">
          <p className="user-info-description">User Info</p>
          <table class="user-info-table">
            <tbody>
              <tr>
                <th>이메일</th>
                <td>{user ? user.email : ""}</td>
              </tr>
              <tr>
                <th>전화번호</th>
                <td>{user ? user.phone : ""}</td>
              </tr>
              <tr>
                <th>학번</th>
                <td>{user ? user.student_id : ""}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="right-container">
          <div class="user-status-container">
            <div class="user-status-content">
              <p className="user-status-description">User Status</p>
              <p>{user ? USER_STATUS_MAP[user.status] : ""}</p>
            </div>
            <button onClick={handleEnroll} className="enroll-button">
              입금 등록
            </button>
          </div>
          <div class="buttons-container">
            <button
              onClick={() => router.push("/us/edit-user-info")}
              className="enroll-button"
            >
              정보 수정
            </button>
            <button
              onClick={() => router.push("/about/welcome")}
              className="enroll-button chat-join-button"
            >
              <span className="material-icons">forum</span>
              채팅 입장
            </button>
            <button onClick={handleLogout} className="logout-button">
              <span class="material-icons">logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
