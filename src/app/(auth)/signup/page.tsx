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

type FormInputs = {
  email: string;
  emailCode: string;
  password: string;
  studentID: string;
  name: string;
  phoneNumber: string;
  department: string;
};

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

const EmailNotice = ({ state }: { state: EmailState }) => {
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

const EmailCodeNotice = ({ state }: { state: EmailCodeState }) => {
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

const PasswordNotice = ({ state }: { state: PasswordState }) => {
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

const StudentIDNotice = ({ state }: { state: StudentIDState }) => {
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

const NameNotice = ({ state }: { state: NameState }) => {
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

const PhoneNumberNotice = ({ state }: { state: PhoneNumberState }) => {
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

export default function SignupPage() {
  const signupStore = useSignupStore();

  const { register, control, handleSubmit } = useForm<FormInputs>({
    defaultValues: {
      email: "",
      emailCode: "",
      password: "",
      studentID: "",
      name: "",
      phoneNumber: "",
      department: "",
    },
  });

  const sendEmailCode = () => {
    signupStore.setEmailCodeState(EmailCodeState.SENT);
  };

  async function postSignup(data: FormInputs) {
    const reponse = await fetch(
      process.env.NEXT_PUBLIC_SERVER_URL + "/auth/signup",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          email_code: data.emailCode,
          password: data.password,
          student_id: data.studentID,
          name: data.name,
          phone_number: data.phoneNumber,
        }),
      }
    );

    const result = await reponse.json();
    if (result.success) {
      alert("회원가입이 완료되었습니다.");
    } else {
      if (result.detail && result.detail == "invalid_email_code") {
        signupStore.setEmailCodeState(EmailCodeState.INCORRECT);
      }
    }
  }

  const onSubmit = (data: FormInputs) => {
    Validator.email(data.email, (isValid) =>
      signupStore.setEmailState(
        isValid ? EmailState.VALID : EmailState.MALFORMED
      )
    );
    Validator.emailCode(data.emailCode, (isValid) =>
      signupStore.setEmailCodeState(
        isValid ? EmailCodeState.CORRECT : EmailCodeState.MALFORMED
      )
    );
    Validator.password(data.password, (isValid) =>
      signupStore.setPasswordState(
        isValid ? PasswordState.VALID : PasswordState.MALFORMED
      )
    );
    Validator.studentID(data.studentID, (isValid) =>
      signupStore.setStudentIDState(
        isValid ? StudentIDState.VALID : StudentIDState.MALFORMED
      )
    );
    Validator.name(data.name, (isValid) =>
      signupStore.setNameState(isValid ? NameState.VALID : NameState.MALFORMED)
    );
    Validator.phoneNumber(data.phoneNumber, (isValid) =>
      signupStore.setPhoneNumberState(
        isValid ? PhoneNumberState.VALID : PhoneNumberState.MALFORMED
      )
    );

    if (
      signupStore.emailState != EmailState.MALFORMED &&
      signupStore.emailCodeState != EmailCodeState.MALFORMED &&
      signupStore.passwordState != PasswordState.MALFORMED &&
      signupStore.StudentIDState != StudentIDState.MALFORMED &&
      signupStore.nameState != NameState.MALFORMED &&
      signupStore.phoneNumberState != PhoneNumberState.MALFORMED
    ) {
      console.log("Proceeding to signup");
      postSignup(data);
    }
  };

  const onInvalid = () => {
    alert("모든 항목이 기입되지 않았습니다.");
  };

  return (
    <div id="SignupContainer">
      <form id="SignupForm">
        <h1>회원가입</h1>
        <Divider />
        <div id="LoginInfo">
          <Input.Root>
            <Input.Label htmlFor="Email">스누메일</Input.Label>
            <Input.Input
              id="Email"
              placeholder="jonggangjoajoa@snu.ac.kr"
              {...register("email")}
            />
            {<EmailNotice state={signupStore.emailState} />}
          </Input.Root>
          <Input.Root>
            <Input.Label htmlFor="EmailCode">인증코드</Input.Label>
            <div id="EmailCodeContainer">
              <Input.Input
                id="EmailCode"
                placeholder="123456"
                {...register("emailCode")}
              />
              <Button.Root
                type="button"
                id="EmailCodeSend"
                onClick={sendEmailCode}
              >
                <SendIcon />
              </Button.Root>
            </div>
            {<EmailCodeNotice state={signupStore.emailCodeState} />}
          </Input.Root>
          <Input.Root>
            <Input.Label htmlFor="Password">비밀번호</Input.Label>
            <Input.Input
              id="Password"
              type="password"
              placeholder="123456"
              {...register("password")}
            />
            {<PasswordNotice state={signupStore.passwordState} />}
          </Input.Root>
        </div>
        <Divider />
        <div id="UserInfo">
          <Input.Root>
            <Input.Label htmlFor="StudentCode">학번</Input.Label>
            <Input.Input
              id="StudentCode"
              placeholder="20xx-12345"
              {...register("studentID")}
            />
            {<StudentIDNotice state={signupStore.StudentIDState} />}
          </Input.Root>
          <Input.Root>
            <Input.Label htmlFor="Name">이름</Input.Label>
            <Input.Input id="Name" placeholder="홍길동" {...register("name")} />
            {<NameNotice state={signupStore.nameState} />}
          </Input.Root>
          <Input.Root>
            <Input.Label htmlFor="PhoneNumber">전화번호</Input.Label>
            <Input.Input
              id="PhoneNumber"
              placeholder="010-1234-5678"
              {...register("phoneNumber")}
            />
            {<PhoneNumberNotice state={signupStore.phoneNumberState} />}
          </Input.Root>
          <Controller
            name="department"
            control={control}
            rules={{ required: true }}
            render={({ field }) => {
              const { ref, ...restField } = field;
              return (
                <Select.Root onValueChange={restField.onChange} {...restField}>
                  <Select.Label htmlFor="Department">학부 / 학과</Select.Label>
                  <Select.Trigger
                    id="Department"
                    aria-label="Department"
                    ref={ref}
                  >
                    <Select.Value placeholder="학과를 선택하세요" />
                  </Select.Trigger>
                  <Select.Portal>
                    <DepartmentSelectItems />
                  </Select.Portal>
                </Select.Root>
              );
            }}
          ></Controller>
          <Divider />
        </div>
        <div id="SignupButtonsContainer">
          <Button.Root onClick={handleSubmit(onSubmit, onInvalid)}>
            회원가입
          </Button.Root>
        </div>
      </form>
    </div>
  );
}
