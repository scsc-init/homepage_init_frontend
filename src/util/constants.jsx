//변경 가능성이 있는 변수들과 설명입니다. 유지보수시 이 파일에서 수정해주세요.

export const minExecutiveLevel = 500;
// 관리자의 최소 권한입니다. BE의 role level과 name을 관리할 때, 관리자는 반드시 이 변수 이상의 권한을, 비관리자는 이 변수 미만의 권한을 가지고 있어야 합니다.
// 헤더에서 '운영진 페이지'를 표시할지 결정하는 데에 사용됩니다.

export const COLORS = {
  primary: "var(--color-primary)",
  primaryHover: "var(--color-primary-hover)",
  textHeading: "var(--color-text-heading)",
  textBody: "var(--color-text-body)",
  surfaceDark: "var(--color-surface-dark)",
  surfaceLight: "var(--color-surface-light)",
};
// 전체적인 색들입니다. @/styles/theme.css와 함께 수정해주세요.

export const DEPOSIT_ACC = "국민은행 942902-02-054136";

export const DISCORD_INVITE_LINK = "https://discord.gg/d9McArjXq5";

export const KAKAO_INVITE_LINK = 'https://invite.kakao.com/tc/Nfp743zYME'

export function UTC2KST(date) {
  const utc = date.getTime();
  const kst = new Date(utc + 9 * 60 * 60 * 1000);

  return kst.toLocaleString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
}
