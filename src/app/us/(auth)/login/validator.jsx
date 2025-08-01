export function email(email) {
  return email != undefined && /^[a-zA-Z0-9._%+-]+@snu.ac.kr$/.test(email);
}

export function emailCode(code, then) {
  then && then(code != undefined && /^\d{6}$/.test(code));
}

export function password(password, then) {
  then &&
    then(
      password != undefined && password.length >= 8 && password.length <= 128,
    );
}

export function name(name, then) {
  then && then(name != undefined && name.length <= 64);
}

export function phoneNumber(phoneNumber, then) {
  then &&
    then(
      phoneNumber != undefined &&
        /^01[016789][0-9]{3,4}[0-9]{4}$/.test(phoneNumber),
    );
}

export function studentID(studentID, then) {
  then && then(studentID != undefined && /^[0-9]{4}[0-9]{5}$/.test(studentID));
}
