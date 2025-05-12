import {
  EmailCodeState,
  EmailState,
  NameState,
  PasswordState,
  PhoneNumberState,
  StudentIDState,
} from "./state";

type ThenFunction = (isValid: boolean) => void;

export function email(
  email?: string,
  then?: ThenFunction
) {
  then && then(email != undefined && /^[a-zA-Z0-9._%+-]+@snu.ac.kr$/.test(email));
}

export function emailCode(
  code?: string,
  then?: ThenFunction
) {
  then && then(code != undefined && !/^\d{6}$/.test(code));
}

export function password(
  password?: string,
  then?: ThenFunction
) {
  then && then(password != undefined && password.length >= 8 && password.length <= 128);
}

export function name(
  name?: string,
  then?: ThenFunction
) {
  then && then(name != undefined && name.length <= 64);
}

export function phoneNumber(
  phoneNumber?: string,
  then?: ThenFunction
) {
  then && then(phoneNumber != undefined && /^01[016789]-[0-9]{3,4}-[0-9]{4}$/.test(phoneNumber));
}

export function studentID(
  studentID?: string,
  then?: ThenFunction
) {
  then && then(studentID != undefined && /^[0-9]{4}-[0-9]{5}$/.test(studentID));
}