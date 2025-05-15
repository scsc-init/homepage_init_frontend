import { SetAction } from "@/util/setAction";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export enum EmailState {
  VALID,
  MALFORMED,
}

export enum EmailCodeState {
  CORRECT,
  INCORRECT,
  SENT,
  MALFORMED,
}

export enum PasswordState {
  VALID,
  MALFORMED,
}

export enum StudentIDState {
  VALID,
  MALFORMED,
}
////
export enum NameState {
  VALID,
  MALFORMED,
}

export enum PhoneNumberState {
  VALID,
  MALFORMED,
}

export enum DepartmentState {
  VALID,
  MALFORMED,
}

export interface SignupActions {
  setEmailState: SetAction<EmailState>;
  setEmailCodeState: SetAction<EmailCodeState>;
  setPasswordState: SetAction<PasswordState>;
  setStudentIDState: SetAction<StudentIDState>;
  setNameState: SetAction<NameState>;
  setPhoneNumberState: SetAction<PhoneNumberState>;
  setDepartmentState: SetAction<DepartmentState>;
}

export interface SignupState {
  emailState: EmailState;
  emailCodeState: EmailCodeState;
  passwordState: PasswordState;
  StudentIDState: StudentIDState;
  nameState: NameState;
  phoneNumberState: PhoneNumberState;
  departmentState: DepartmentState;
}

export const useSignupStore = create<SignupState & SignupActions>()(
  immer((set) => ({
    emailState: EmailState.VALID,
    emailCodeState: EmailCodeState.CORRECT,
    passwordState: PasswordState.VALID,
    StudentIDState: StudentIDState.VALID,
    nameState: NameState.VALID,
    phoneNumberState: PhoneNumberState.VALID,
    departmentState: DepartmentState.VALID,

    setEmailState: (newState) =>
      set((state) => {
        state.emailState = newState;
      }),
    setEmailCodeState: (newState) =>
      set((state) => {
        state.emailCodeState = newState;
      }),
    setPasswordState: (newState) =>
      set((state) => {
        state.passwordState = newState;
      }),
    setStudentIDState: (newState) =>
      set((state) => {
        state.StudentIDState = newState;
      }),
    setNameState: (newState) =>
      set((state) => {
        state.nameState = newState;
      }),
    setPhoneNumberState: (newState) =>
      set((state) => {
        state.phoneNumberState = newState;
      }),
    setDepartmentState: (newState) =>
      set((state) => {
        state.departmentState = newState;
      }),
  }))
);
