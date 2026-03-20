type ValidatorCallback = (isValid: boolean) => void;

/**
 * 서울대 이메일 형식인지 검증합니다.
 *
 * @param email - Email
 * @returns 유효 여부
 */
export function email(email: string | undefined | null): boolean {
  return email != undefined && /^[a-zA-Z0-9._%+-]+@snu.ac.kr$/.test(email);
}

/**
 * 이메일 인증 코드 형식인지 검증합니다.
 *
 * @param code - Verification code
 * @param then - Validation callback
 */
export function emailCode(code: string | undefined | null, then?: ValidatorCallback): void {
  then && then(code != undefined && /^\d{6}$/.test(code));
}

/**
 * 비밀번호 형식인지 검증합니다.
 *
 * @param password - Password
 * @param then - Validation callback
 */
export function password(password: string | undefined | null, then?: ValidatorCallback): void {
  then && then(password != undefined && password.length >= 8 && password.length <= 128);
}

/**
 * 이름 형식인지 검증합니다.
 *
 * @param name - Name
 * @param then - Validation callback
 */
export function name(name: string | undefined | null, then?: ValidatorCallback): void {
  then && then(name != undefined && name.length <= 64);
}

/**
 * 휴대전화 번호 형식인지 검증합니다.
 *
 * @param phoneNumber - Phone number
 * @param then - Validation callback
 */
export function phoneNumber(
  phoneNumber: string | undefined | null,
  then?: ValidatorCallback,
): void {
  then && then(phoneNumber != undefined && /^010\d{8}$/.test(phoneNumber));
}

/**
 * 학번 형식인지 검증합니다.
 *
 * @param studentID - Student ID
 * @param then - Validation callback
 */
export function studentID(
  studentID: string | undefined | null,
  then?: ValidatorCallback,
): void {
  if (studentID == null) {
    then && then(false);
    return;
  }

  const match = studentID.match(/^(\d{4})(\d{5})$/);
  if (!match) {
    then && then(false);
    return;
  }

  const year = parseInt(match[1], 10);
  const currentYear = new Date().getFullYear();
  const isValid = year >= 1946 && year <= currentYear;

  then && then(isValid);
}
