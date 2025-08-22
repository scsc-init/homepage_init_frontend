# InitFrontend

Next.js App Router 기반으로 구축되었으며, 사용자 인증, SIG 생성, 게시판 등 다양한 기능을 지원합니다.

> 최신개정일 : 2025-08-05
> 작성자 : 이한경 윤영우 강명석 박성현
> 최신개정자 : 윤영우

---

## 브랜치 설명

- main: 배포된 코드를 저장하며 버전 별로 태그가 붙어 있습니다.
- develop(default): 개발 중인 코드를 저장합니다.

---

## 주요 폴더 구조 및 페이지 설명

```txt
src/
└── app/
    ├── about/
    │   ├── developers/         # 개발자 소개 페이지
    │   ├── executives/         # 운영진 소개 페이지
    │   ├── my-page/            # 내 정보 페이지
    │   ├── rules/              # 회칙 페이지 : 마크다운 파일을 불러와서 띄움
    │   └── page.jsx            # SCSC 소개 메인 페이지
    ├── api/                    # Nextjs 서버 라우터
    ├── article/[id]/           # 게시글 상세 페이지
    ├── board/[id]/             # 게시글 목록 페이지 (id별)
    │   └── create/             # 새 글 작성 페이지
    ├── executive/              # 운영진 전용 관리 페이지
    ├── pig/
    │   ├── [id]/               # 개별 PIG 상세 페이지
    │   ├── create/             # 새 PIG 생성 페이지
    │   ├── PigCreateButton.jsx # PIG 생성 버튼
    │   └── page.jsx            # 전체 PIG 목록 페이지
    ├── sig/
    │   ├── [id]/               # 개별 SIG 상세 페이지
    │   ├── create/             # SIG 생성 페이지
    │   ├── SigCreateButton.jsx # SIG 생성 버튼
    │   └── page.jsx            # 전체 SIG 목록 페이지
    └── us/
        └── (auth)/login/       # 로그인 + 회원가입 페이지
        ├── validator.jsx       # 사용자 데이터 유효성 검사
        └── contact/            # 연락처 및 회원가입 링크
```

---

## 환경 변수 설명

| Key Name               | Description                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `BACKEND_URL`          | 연결된 BE 서버의 외부 URL                                                                   |
| `API_SECRET`           | BE 서버에서 처리되는 API KEY                                                                |
| `GOOGLE_CLIENT_ID`     | 구글 OAuth 애플리케이션으로 등록된 ID (하단의 `Google Auth 2.0 관리` 참조)                  |
| `GOOGLE_CLIENT_SECRET` | 구글 OAuth 애플리케이션의 secret (하단의 `Google Auth 2.0 관리` 참조)                       |
| `NEXTAUTH_SECRET`      | NextAuth 에 사용될 secret, 임의로 생성함 (하단의 `next auth 설정` 참조)                     |
| `NEXTAUTH_URL`         | NextAuth 에 사용될 메인 URL, 프론트서버의 도메인 주소와 동일 (하단의 `next auth 설정` 참조) |
| `SNU_EMAIL_CHECK`      | 디버깅용. 구글 OAuth로 회원가입 시 snu 도메인인지 체크 여부                                 |

## 설치 및 실행 방법

### 1. 레포지토리 클론

```bash
git clone https://github.com/scsc-init/homepage_init_frontend.git
```

### 2. 패키지 설치

```bash
npm install
npm install react-swipeable

```

### 3. `.env.local` 설정

아래 내용을 `.env.local` 파일에 넣어주세요:

```env
BACKEND_URL=http://localhost:8080
API_SECRET=some-secret-code
GOOGLE_CLIENT_ID=구글_콘솔에서_받은_클라이언트_ID
GOOGLE_CLIENT_SECRET=구글_콘솔에서_받은_클라이언트_SECRET
NEXTAUTH_SECRET= openssl rand -base64 32 터미널에 입력해서 나온 값
NEXTAUTH_URL=https://your-domain.com (로컬에서는 http://localhost:3000)
SNU_EMAIL_CHECK=TRUE
NEXT_PUBLIC_DEPOSIT_ACC=국민은행 942902-02-054136 (강명석) 동비 입금 계좌와 입금자명
NEXT_PUBLIC_DISCORD_INVITE_LINK=https://discord.gg/SmXFDxA7XE 디코 초대 링크
NEXT_PUBLIC_KAKAO_INVITE_LINK=https://open.kakao.com/o/XXXXXXXX 카카오톡 초대 링크
```

Google OAuth, NextAuth 설정에 관한 자세한 설명은 아래를 참고하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

접속: [http://localhost:3000](http://localhost:3000)

---

## Google Auth 2.0 관리

- **scsc 구글 계정 또는 공식 도메인이 변경될 경우 auth 관련 코드를 수정할 필요가 있습니다.**

- https://console.cloud.google.com/auth/clients에 접속하세요
- OAuth 2.0 Client IDs 항목에서 **+ Create Credentials** 클릭 후 OAuth 클라이언트 ID를 선택하십시오.
- 유형은 웹 애플리케이션으로 선택하십시오.
- Authorized redirect URIs(승인된 리디렉션 URI)를 입력하세요. *로그인 성공 후 사용자를 돌려보낼 주소*를 입력하면 됩니다.
- 보통 로컬 개발환경인 경우 http://localhost:3000/api/auth/callback/google를, 배포 환경인 경우 https://(your-domain)/api/auth/callback/google을 입력하면 됩니다.
- 발급된 Client ID를 복사해주세요.

## next auth 설정

- 아래 내용을 `.env.local`에 추가하십시오.

```env
GOOGLE_CLIENT_ID=구글_콘솔에서_받은_클라이언트_ID
GOOGLE_CLIENT_SECRET=구글_콘솔에서_받은_클라이언트_SECRET
NEXTAUTH_SECRET= openssl rand -base64 32 터미널에 입력해서 나온 값
NEXTAUTH_URL=https://your-domain.com (로컬에서는 http://localhost:3000)
```

- client id, secret은 api/auth/[...nextauth]/route.js에서 사용합니다.
- nextauth secret은 임의로 정한 뒤, 배포할 때 환경변수 등록하시면 됩니다.
- nextauth url은 도메인 받아서 넣으시면 됩니다.

---

## 주요 기술 스택

- **Next.js 14 (App Router)**
- **React 18**, TypeScript
- **Zustand**: 상태 관리
- **CSS Modules**
- **ESLint + Prettier**

---

## 유지보수 관련 사항

/util/constatns.jsx에 프론트에서 설정해야할 변수와 값들이 있습니다. 수정할 필요가 있다면 백엔드와 협의해 작성해주세요.
