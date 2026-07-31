export const EXECUTIVE_NAV_GROUPS = [
  {
    title: '대시보드',
    items: [
      {
        title: '관리자 홈',
        description: '관리자 기능 요약과 주요 상태를 확인합니다.',
        href: '/executive',
      },
    ],
  },
  {
    title: '회원',
    items: [
      {
        title: '회원 관리',
        description: '회원 목록, 임원진 구성, 등록/외부회원/졸업생 관리를 수행합니다.',
        href: '/executive/user',
      },
      {
        title: '유저 활동 기록',
        description: '회원의 등록, SIG/PIG 가입/탈퇴, 임원 변경 기록을 확인합니다.',
        href: '/executive/user/activity-logs',
      },
      {
        title: '회장단 전용 관리',
        description: '회장단 전용 기능과 데이터 백업 기능을 관리합니다.',
        href: '/executive/user/leadership',
      },
    ],
  },
  {
    title: '콘텐츠',
    items: [
      {
        title: '게시글 관리',
        description: '게시판별 게시글을 관리합니다.',
        href: '/executive/board',
      },
      {
        title: '지원금 신청 게시판',
        description: '지원금 신청 게시판으로 이동합니다.',
        href: '/board/6',
        external: true,
      },
      {
        title: 'HTML 페이지 관리',
        description: '정적 HTML 페이지를 업로드, 수정, 삭제합니다.',
        href: '/executive/w',
      },
      {
        title: 'KV table 관리',
        description: '홈페이지에서 사용하는 key-value 설정을 관리합니다.',
        href: '/executive/kv',
      },
    ],
  },
  {
    title: 'SIG/PIG',
    items: [
      {
        title: 'SIG 관리',
        description: 'SIG 목록과 구성원을 관리합니다.',
        href: '/executive/sig',
      },
      {
        title: 'PIG 관리',
        description: 'PIG 목록과 구성원을 관리합니다.',
        href: '/executive/pig',
      },
    ],
  },
  {
    title: '기준 정보',
    items: [
      {
        title: '전공 관리',
        description: '전공 목록을 관리합니다.',
        href: '/executive/major',
      },
    ],
  },
];

export const EXECUTIVE_NAV_ITEMS = EXECUTIVE_NAV_GROUPS.flatMap((group) => group.items);
