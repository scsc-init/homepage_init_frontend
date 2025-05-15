"use client";
import * as Input from "@/components/Input";
import * as Button from "@/components/Button";
import * as Select from "@/components/Select";
import * as Notice from "@/components/Notice";
import * as Validator from "./validator";
import "./page.css";
import Divider from "@/components/Divider";
import React from "react";
import Departments from "@/data/departments";
import {
  EmailCodeState,
  EmailState,
  NameState,
  PasswordState,
  PhoneNumberState,
  StudentIDState,
  useSignupStore,
} from "./state";
import { Controller, useForm } from "react-hook-form";
;
const SendIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1rem"
      height="1rem"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14L21 3m0 0l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1z"
      />
    </svg>
  );
};
const SuccessIcon = () => {
  return (
    <svg
      className="SignupSuccessIcon"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M17 3.34a10 10 0 1 1-14.995 8.984L2 12l.005-.324A10 10 0 0 1 17 3.34m-1.293 5.953a1 1 0 0 0-1.32-.083l-.094.083L11 12.585l-1.293-1.292l-.094-.083a1 1 0 0 0-1.403 1.403l.083.094l2 2l.094.083a1 1 0 0 0 1.226 0l.094-.083l4-4l.083-.094a1 1 0 0 0-.083-1.32"
      />
    </svg>
  );
};
const AlertIcon = () => {
  return (
    <svg
      className="SignupAlerticon"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1-19.995.324L2 12l.004-.28C2.152 6.327 6.57 2 12 2m.01 13l-.127.007a1 1 0 0 0 0 1.986L12 17l.127-.007a1 1 0 0 0 0-1.986zM12 7a1 1 0 0 0-.993.883L11 8v4l.007.117a1 1 0 0 0 1.986 0L13 12V8l-.007-.117A1 1 0 0 0 12 7"
      />
    </svg>
  );
};
const DepartmentSelectItems = () => {
  return (
    <>
      {Object.entries(Departments).map(([college, departments]) => (
        <>
          <Select.Group key={college}>
            <Select.GroupLabel>{college}</Select.GroupLabel>
            {departments.map((department) => (
              <Select.Item key={college + " " + department} value={department}>
                {department}
              </Select.Item>
            ))}
          </Select.Group>
          <Select.Separator key={college} />
        </>
      ))}
      <Select.Group key="기타">
        <Select.GroupLabel>기타</Select.GroupLabel>
        <Select.Item key="기타" value="기타">
          기타
        </Select.Item>
      </Select.Group>
    </>
  );
};
const EmailNotice = ({ state }) => {
  return (
    <>
      {state == EmailState.MALFORMED && (
        <Notice.Root id="EmailNotice" className="error">
          <Notice.Icon>
            <AlertIcon />
          </Notice.Icon>
          메일 형식이 올바르지 않거나 스누메일이 아닙니다.
        </Notice.Root>
      )}
    </>
  );
};
const EmailCodeNotice = ({ state }) => {
  return (
    <>
      {state == EmailCodeState.MALFORMED && (
        <Notice.Root id="EmailCodeNotice" className="error">
          <Notice.Icon>
            <AlertIcon />
          </Notice.Icon>
          인증코드가 올바른 형태가 아닙니다.
        </Notice.Root>
      )}
      {state == EmailCodeState.INCORRECT && (
        <Notice.Root id="EmailCodeNotice" className="error">
          <Notice.Icon>
            <AlertIcon />
          </Notice.Icon>
          인증코드가 유효하지 않습니다.
        </Notice.Root>
      )}
      {state == EmailCodeState.SENT && (
        <Notice.Root id="EmailCodeNotice" className="success">
          <Notice.Icon>
            <SuccessIcon />
          </Notice.Icon>
          인증코드가 전송되었습니다.
          <br />
          5분 후 만료됩니다.
        </Notice.Root>
      )}
    </>
  );
};
const PasswordNotice = ({ state }) => {
  return (
    <>
      {state == PasswordState.MALFORMED && (
        <Notice.Root id="EmailCodeNotice" className="error">
          <Notice.Icon>
            <AlertIcon />
          </Notice.Icon>
          <div>
            비밀번호가 올바른 형태가 아닙니다. 다음 사항들을 지켜주세요.
            <li>비밀번호는 8자 이상, 128자 이하여야 합니다.</li>
          </div>
        </Notice.Root>
      )}
    </>
  );
};
const StudentIDNotice = ({ state }) => {
  return (
    <>
      {state == StudentIDState.MALFORMED && (
        <Notice.Root id="StudentIDNotice" className="error">
          <Notice.Icon>
            <AlertIcon />
          </Notice.Icon>
          학번이 올바른 형태가 아닙니다.
        </Notice.Root>
      )}
    </>
  );
};
const NameNotice = ({ state }) => {
  return (
    <>
      {state == NameState.MALFORMED && (
        <Notice.Root id="NameNotice" className="error">
          <Notice.Icon>
            <AlertIcon />
          </Notice.Icon>
          이름이 올바른 형태가 아닙니다.
        </Notice.Root>
      )}
    </>
  );
};
const PhoneNumberNotice = ({ state }) => {
  return (
    <>
      {state == PhoneNumberState.MALFORMED && (
        <Notice.Root id="PhoneNumberNotice" className="error">
          <Notice.Icon>
            <AlertIcon />
          </Notice.Icon>
          전화번호가 올바른 형태가 아닙니다.
        </Notice.Root>
      )}
    </>
  );
};

import { useState, useEffect } from "react";
import axios from "axios";
import {
  email as validateEmail,
  password as validatePassword,
  studentID as validateStudentID,
  name as validateName,
  phoneNumber as validatePhoneNumber,
} from "@/app/(auth)/signup/validator";
export default function SignupPage() {
  const [stage, setStage] = useState(1);
  const [form, setForm] = useState({
    email: "",
    password: "",
    student_id: "",
    name: "",
    phone: "",
    major_id:0,
  });
  ;
  const [majors, setMajors] = useState([]);
  useEffect(() => {
    if (stage === 6) {
      axios
        .get("http://localhost:8080/api/majors", {
          headers: { "x-api-secret": "some-secret-code" }
        })
        .then((res) => {
          setMajors(res.data);
        })
        .catch((err) => {
          console.error("전공 목록 불러오기 실패:", err);
        });
    }
  }, [stage]);
  const handleSubmit = async () => {
  try {
    await axios.post(
      "http://localhost:8080/api/user/create",
      {
        frontend_secret: "some-secret-code",
        ...form,
      },
      {
        headers: {
          "x-api-secret": "some-secret-code",
        },
      }
    );
    alert("회원가입 완료!");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert("회원가입 실패: " + (error.response?.data?.detail || "알 수 없는 오류"));
    } else {
      alert("알 수 없는 오류가 발생했습니다.");
    }
  }
};
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {stage === 1 && (
        <>
          <h2>이메일 입력</h2>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email:e.target.value })}
            placeholder="example@snu.ac.kr"
            className="border p-2 w-full"
          />
          <button
            onClick={() =>
              validateEmail(form.email, (valid) => {
                if (!valid) return alert("이메일 형식은 @snu.ac.kr 로 끝나야 합니다.");
                setStage(2);
              })
            }
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            다음
          </button>
        </>
      )}
      {stage === 2 && (
        <>
          <h2>비밀번호 설정</h2>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password:e.target.value })}
            placeholder="8~128자 비밀번호"
            className="border p-2 w-full"
          />
          <button
            onClick={() =>
              validatePassword(form.password, (valid) => {
                if (!valid) return alert("비밀번호는 8자 이상 128자 이하로 설정해야 합니다.");
                setStage(3);
              })
            }
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            다음
          </button>
        </>
      )}
      {stage === 3 && (
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
            const fullID = `${form.student_id_year}${form.student_id_number}`;
            validateStudentID(fullID, (valid) => {
              if (!valid) return alert("학번 형식은 YYYY-XXXXX 입니다.");
              setForm({ ...form, student_id: `${form.student_id_year}-${form.student_id_number}` });
              setStage(4);
            });
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          다음
        </button>
      </>
    )}
      {stage === 4 && (
        <>
          <h2>이름 입력</h2>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name:e.target.value })}
            placeholder="이름"
            className="border p-2 w-full"
          />
          <button
            onClick={() =>
              validateName(form.name, (valid) => {
                if (!valid) return alert("이름은 64자 이하로 입력해주세요.");
                setStage(5);
              })
            }
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            다음
          </button>
        </>
      )}
      {stage === 5 && (
        <>
          <h2>전화번호 입력</h2>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone:e.target.value })}
            placeholder="01012345678"
            className="border p-2 w-full"
          />
          <button
            onClick={() =>
              validatePhoneNumber(form.phone, (valid) => {
                if (!valid) return alert("전화번호 형식은 010XXXXXXXX 입니다.");
                setStage(6);
              })
            }
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            다음
          </button>
        </>
      )}
      {stage === 6 && (
        <>
          <h2>전공 선택</h2>
          <select
            className="border p-2 w-full"
            onChange={(e) => setForm({ ...form, major_id: Number(e.target.value) })}
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
            className="bg-green-600 text-white px-4 py-2 rounded mt-2"
          >
            가입하기
          </button>
        </>
      )}
    </div>
  );
}
