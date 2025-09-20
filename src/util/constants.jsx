//변경 가능성이 있는 변수들과 설명입니다. 유지보수시 이 파일에서 수정해주세요.

export const minExecutiveLevel = 500;
// 관리자의 최소 권한입니다. BE의 role level과 name을 관리할 때, 관리자는 반드시 이 변수 이상의 권한을, 비관리자는 이 변수 미만의 권한을 가지고 있어야 합니다.
// 헤더에서 '운영진 페이지'를 표시할지 결정하는 데에 사용됩니다.
export const oldboyLevel = 400;
// 졸업생 권한의 값입니다. 내 정보 수정 페이지에서 사용됩니다.
export const SEMESTER_MAP = { 1: '1', 2: '여름', 3: '2', 4: '겨울' };
// 학기 숫자에 대응되는 학기 표시값입니다.

const CTRL_STATUS_AVAILABLE = {
  JOIN_SIGPIG: ['surveying', 'recruiting'],
  JOIN_SIGPIG_ROLLING_ADMISSION: ['surveying', 'recruiting', 'active'],
};
// 시그/피그에 가입/탈퇴할 수 있는 시그/피그의 상태 목록입니다. BE의 src/controller/scsc.py에서 정의합니다.
/**
 *
 * @param {String} status sig/pig status
 * @param {Boolean} is_rolling_admission sig/pig is_rolling_admission
 * @returns {Boolean}
 */
export function is_sigpig_join_available(status, is_rolling_admission) {
  const rolling =
    typeof is_rolling_admission === 'boolean'
      ? is_rolling_admission
      : String(is_rolling_admission).toLowerCase() === 'true';
  const key = rolling ? 'JOIN_SIGPIG_ROLLING_ADMISSION' : 'JOIN_SIGPIG';
  return CTRL_STATUS_AVAILABLE[key].includes(status);
}

export const COLORS = {
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  textHeading: 'var(--color-text-heading)',
  textBody: 'var(--color-text-body)',
  surfaceDark: 'var(--color-surface-dark)',
  surfaceLight: 'var(--color-surface-light)',
};
// 전체적인 색들입니다. @/styles/theme.css와 함께 수정해주세요.
function pickEnv(...vals) {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

export const DEPOSIT_ACC = pickEnv(
  process.env.NEXT_PUBLIC_DEPOSIT_ACC,
  process.env.DEPOSIT_ACC,
  '국민은행 942902-02-054136 (강명석)',
);

export const DISCORD_INVITE_LINK = pickEnv(
  process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK,
  process.env.DISCORD_INVITE_LINK,
  'https://discord.gg/SmXFDxA7XE',
);

export const KAKAO_INVITE_LINK = pickEnv(
  process.env.NEXT_PUBLIC_KAKAO_INVITE_LINK,
  process.env.KAKAO_INVITE_LINK,
  'https://invite.kakao.com/tc/II2yiLsQhY',
);
export function utc2kst(date) {
  const utc = date.getTime();
  const kst = new Date(utc + 9 * 60 * 60 * 1000);

  return kst.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
}
