// @/util/constants.js

/**
 * @file 변경 가능성이 있는 변수들과 설명을 모아둔 파일입니다.
 * @description 유지보수 시 반드시 이 파일에서 수정하세요.
 */

/**
 * 관리자의 최소 권한 레벨입니다.
 * - BE의 role level과 name을 관리할 때, 관리자는 반드시 이 값 **이상**의 권한을,
 *   비관리자는 이 값 **미만**의 권한을 가져야 합니다.
 * - 헤더에서 '운영진 페이지' 표시 여부를 결정하는 데 사용됩니다.
 */
export const minExecutiveLevel = 500;
/** 졸업생 권한 레벨 값입니다. 내 정보 수정 페이지에서 사용됩니다. */
export const oldboyLevel = 400;

/**
 * 학기 숫자에 대응되는 학기 표시값입니다.
 * @type {Record<number, string>}
 */
export const SEMESTER_MAP = { 1: '1', 2: '여름', 3: '2', 4: '겨울' };

export const STATUS_MAP = {
  inactive: '비활성',
  recruiting: '모집중',
  active: '활동중',
};

/**
 * Returns the first valid string among the provided values.
 *
 * @param {...(string|undefined|null)} vals - Candidate values.
 * @returns {string} The first non-empty string found, or an empty string if none exist.
 */
function pickEnv(...vals) {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

/**
 * 하드코딩된 정보들입니다.
 */
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

/**
 * 헤더에 들어가는 네비게이션 정보입니다.
 * @type {{title: string, items: {label: string, url: string}[]}[]}
 */
export const headerMenuData = [
  {
    title: 'About us',
    items: [
      { label: 'SCSC', url: '/about' },
      { label: 'Executives', url: '/about/executives' },
      { label: 'Developers', url: '/about/developers' },
      { label: 'Rules', url: '/about/rules' },
    ],
  },
  {
    title: 'Board',
    items: [
      { label: 'Project Archives', url: '/board/3' },
      { label: 'Album', url: '/board/4' },
      { label: 'Notice', url: '/board/5' },
    ],
  },
  {
    title: 'SIG/PIG',
    items: [
      { label: 'SIG', url: '/sig' },
      { label: 'PIG', url: '/pig' },
    ],
  },
  {
    title: 'Contact',
    items: [
      { label: 'Contact Us!', url: '/us/contact' },
      { label: 'Fund Apply', url: '/us/fund-apply/create' },
    ],
  },
];

/**
 * 푸터에 표시되는 로고 정보입니다. 순서대로 푸터에 표시됩니다. 현재 사용되지 않는 로고는 코멘트 처리되어있습니다.
 * @type {{href: string, src: string, alt: string}[]}
 */
export const footerLogoData = [
  {
    href: 'mailto:scsc.snu@gmail.com',
    src: '/vectors/mail.svg',
    alt: 'Mail',
  },
  {
    href: DISCORD_INVITE_LINK,
    src: '/vectors/discord.svg',
    alt: 'Discord',
  },
  {
    href: 'https://github.com/SNU-SCSC',
    src: '/vectors/github.svg',
    alt: 'GitHub',
  },
  {
    href: 'https://www.instagram.com/scsc_snu/?hl=ko',
    src: '/vectors/instagram.svg',
    alt: 'Instagram',
  },
  // {
  //   href: "https://www.facebook.com/scscian/",
  //   src: "/vectors/facebook.svg",
  //   alt: "Facebook",
  // },
];

/**
 * 푸터가 표시되지 않는 라우트의 리스트입니다.
 * @type {string[]}
 */
export const hideFooterRoutes = ['/', '/us/login', '/signup', '/about/my-page'];

/**
 * 시그/피그 가입/탈퇴가 가능한 상태 목록입니다.
 * BE의 src/controller/scsc.py에서 정의합니다.
 */
const CTRL_STATUS_AVAILABLE = {
  JOIN_SIGPIG: ['recruiting'],
  JOIN_SIGPIG_ROLLING_ADMISSION: ['recruiting', 'active'],
};

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

/*
 * 전체적인 색상 정의와 관련된 설정입니다.
 * 반드시 @/styles/theme.css와 함께 수정해야 합니다.
 */
export const COLORS = {
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  textHeading: 'var(--color-text-heading)',
  textBody: 'var(--color-text-body)',
  surfaceDark: 'var(--color-surface-dark)',
  surfaceLight: 'var(--color-surface-light)',
};

/**
 *
 * @param {string | number | Date} date utc datetime
 * @returns {string} kst datetime
 */
export function utc2kst(date) {
  const utc = new Date(date).getTime();
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

/** 임원진 페이지에서 제외할 이메일 목록 */
export const excludedExecutiveEmails = [
  'bot@discord.com',
  'deposit.app@scsc.dev',
  'tteokgook1@snu.ac.kr',
  '1n1tial@snu.ac.kr',
];

export const DEFAULT_EXECUTIVE_PFP = '/asset/default-pfp.png';

/**
 * 임원진 페이지의 KV 편집 페이지에서 제외할 key(별도의 관리 페이지가 있는 경우)
 */
export const HIDDEN_KV_KEYS = ['main-president', 'vice-president'];

/**
 * 앨범 게시판의 id입니다.
 */
export const ALBUM_BOARD_ID = 4;

/**
 * 각각 이미지 업로드가 허용되는 최대 용량, 서버에 전송시 막히는 용량, 이미지 압축 용량입니다.
 */
export const IMAGE_UPLOAD_MAX_ORIGINAL_BYTES = 10_000_000; // 10MB
export const IMAGE_UPLOAD_VERCEL_BLOCK_BYTES = 5_000_000; // 5MB
export const IMAGE_UPLOAD_TARGET_BYTES = 4_800_000; // ~4.8MB

/**
 * 로그인 이후 돌아갈 수 있는 리다이렉트 경로의 화이트리스트(prefix)입니다.
 * 이 목록에 포함되지 않은 경로로는 리다이렉트하지 않습니다.
 * 특히 /us/login을 넣으면 무한로딩에 걸리니 주의하십시오.
 * @type {string[]}
 */
export const ALLOWED_REDIRECT_PREFIXES = [
  '/us/fund-apply',
  '/board',
  '/article',
  '/sig',
  '/pig',
  '/us/edit-user-info',
  '/executive',
];

/**
 * 테스트 유틸리티 페이지 활성화 여부입니다.
 */
export const ENABLE_TEST_UTILS = process.env.ENABLE_TEST_UTILS === 'TRUE' ?? false;
