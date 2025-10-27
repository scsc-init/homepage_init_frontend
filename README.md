# InitFrontend

Next.js **14** App Router 기반으로 구축된 SCSC init의 FE 코드입니다.

> 작성일: 2025-05-12
>
> 최신개정일 : 2025-10-26
>
> 작성자 : 이한경 윤영우 강명석 박성현
>
> 최신개정자 : 박성현

---

## 🧭 Branch Management

브랜치 관리는 **git flow**를 지향합니다.

- **main**: 배포용 브랜치입니다. 각 커밋에는 버전 태그(`vX.Y`)가 붙습니다.
- **develop (default)**: 개발 중인 코드입니다. PR은 develop으로 날려주세요.

### 작업 브랜치 규칙

- 브랜치 이름은 반드시 `feature/` 접두어를 사용합니다.  
  예) `feature/sig-create`, `feature/fund-apply-fix`
- PR 제목에는 GitHub 이모지와 요약 문장을 사용합니다.  
  예) `✨ SIG 생성 폼 검증 추가`
- PR 본문에는 반드시 관련 이슈를 `fix #123` 형태로 언급합니다.
- 병합은 **Squash and merge**로만 진행합니다.

```bash
git fetch
git checkout -b feature/<slug> origin/develop
# 작업...
git add .
git commit -m "..."
git push -u origin feature/<slug>
# → develop 브랜치로 PR 생성
```

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

| Key Name                          | Description                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `BACKEND_URL`                     | 연결된 BE 서버의 외부 URL                                                                   |
| `API_SECRET`                      | BE 서버에서 처리되는 API KEY                                                                |
| `GOOGLE_CLIENT_ID`                | 구글 OAuth 애플리케이션으로 등록된 ID (하단의 `Google Auth 2.0 관리` 참조)                  |
| `GOOGLE_CLIENT_SECRET`            | 구글 OAuth 애플리케이션의 secret (하단의 `Google Auth 2.0 관리` 참조)                       |
| `NEXTAUTH_SECRET`                 | NextAuth 에 사용될 secret, 임의로 생성함 (하단의 `next auth 설정` 참조)                     |
| `NEXTAUTH_URL`                    | NextAuth 에 사용될 메인 URL, 프론트서버의 도메인 주소와 동일 (하단의 `next auth 설정` 참조) |
| `SNU_EMAIL_CHECK`                 | 디버깅용. 구글 OAuth로 회원가입 시 snu 도메인인지 체크 여부                                 |
| `NEXT_PUBLIC_DEPOSIT_ACC`         | 동비 입금 계좌와 입금자명                                                                   |
| `NEXT_PUBLIC_DISCORD_INVITE_LINK` | 디스코드 초대 링크                                                                          |
| `NEXT_PUBLIC_KAKAO_INVITE_LINK`   | 카카오톡 초대 링크                                                                          |

```env
BACKEND_URL=http://localhost:8080
API_SECRET=some-secret-code
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
SNU_EMAIL_CHECK=TRUE
```

---

## 🧩 Install & Execute

### 1. 레포지토리 클론

```bash
git clone https://github.com/scsc-init/homepage_init_frontend.git
```

### 2. 패키지 설치

```bash
npm ci
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
NEXT_PUBLIC_DEPOSIT_ACC=국민은행 942902-02-054136 (강명석)
NEXT_PUBLIC_DISCORD_INVITE_LINK=https://discord.gg/SmXFDxA7XE
NEXT_PUBLIC_KAKAO_INVITE_LINK=https://invite.kakao.com/tc/II2yiLsQhY
```

Google OAuth, NextAuth 설정에 관한 자세한 설명은 다음 섹션을 참고하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

접속: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Authentication: Google OAuth 2.0

- **scsc 구글 계정 또는 공식 도메인이 변경될 경우 auth 관련 코드를 수정할 필요가 있습니다.**

- https://console.cloud.google.com/auth/clients에 접속하세요
- OAuth 2.0 Client IDs 항목에서 **+ Create Credentials** 클릭 후 OAuth 클라이언트 ID를 선택하십시오.
- 유형은 웹 애플리케이션으로 선택하십시오.
- Authorized redirect URIs(승인된 리디렉션 URI)를 입력하세요. *로그인 성공 후 사용자를 돌려보낼 주소*를 입력하면 됩니다.
- 보통 로컬 개발환경인 경우 http://localhost:3000/api/auth/callback/google를, 배포 환경인 경우 https://(your-domain)/api/auth/callback/google을 입력하면 됩니다.
- 발급된 Client ID를 복사해주세요.

### next auth 설정

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

### 인증 흐름

1. 사용자가 Google 로그인
2. `AuthClient.jsx` → `/api/auth/[...nextauth]/route.js` 호출
3. 성공 시 JWT 세션 쿠키 생성

---

## 🧱 Configurations

### Lint & Prettier

> 코드 스타일과 가독성 개선을 위해 사용합니다.

- `.prettierrc`:코드 포맷터입니다.
- `pre-commit`:포맷 검증에 통과하지 못한 코드의 커밋을 방지합니다.
- `ESLint`:React Hooks 규칙 강제, unused import 금지, import 정렬 적용에 사용합니다.

아래 명령어를 실행해 사용해주세요.

```bash
#1 Husky 설치(최초 1회)
npx husky install

#2 포맷
npm run format         # Prettier로 전체 포맷

#3 lint
npm run lint
npm run lint:fix
```

PR 후에 lint 경고가 발생한 경우

```bash
npx prettier --write .
```

로 prettier를 적용하면 됩니다.

### JSDoc 규칙

- 주석 작성은 **JSDoc** 양식에 따라주세요.
- 예시:

```js
/**
 * @param {string} url Source image URL
 * @returns {string} URL with high-resolution parameters applied when applicable
 */
```

---

## 🧮 utils/constants.jsx

| Key                       | 예시 값                                   | 설명                                        |
| ------------------------- | ----------------------------------------- | ------------------------------------------- |
| `minExecutiveLevel`       | 500                                       | 운영진 권한 기준값                          |
| `oldboyLevel`             | 400                                       | 졸업생 권한                                 |
| `DEPOSIT_ACC`             | 국민은행 942902-02-054136 (강명석)        | 입금 계좌                                   |
| `DISCORD_INVITE_LINK`     | discord.gg/SmXFDxA7XE                     | 디스코드 초대 링크                          |
| `KAKAO_INVITE_LINK`       | invite.kakao.com/tc/...                   | 카카오톡 초대 링크                          |
| `hideFooterRoutes`        | `['/', '/us/login', '/about/my-page']`    | 푸터를 숨길 라우트                          |
| `presidentEmails`         | `[sungjae0506@snu.ac.kr]`                 | 회장 이메일                                 |
| `excludedExecutiveEmails` | `[bot@discord.com, deposit.app@scsc.dev]` | 임원 목록에서 제외할 이메일                 |
| `COLORS`                  | `primary: 'var(--color-primary)'`         | 전체적인 색상 정의로, theme.css와 함께 수정 |

> **주의:** constants 변경 시 backend의 권한 상수와 일치해야 합니다.

---

## 🗝️ KV Table

| Key              | 예시 값                                                                 | 설명        | 형식   |
| ---------------- | ----------------------------------------------------------------------- | ----------- | ------ |
| `footer-message` | 서울대학교 컴퓨터 연구회\n회장 한성재 010-5583-1811\nscsc.snu@gmail.com | 푸터 메시지 | 문자열 |

---

## Cookie & Storage

| Key       | Storage        | TTL      | 접근성               | 설명                                                   |
| --------- | -------------- | -------- | -------------------- | ------------------------------------------------------ |
| `theme`   | Cookie         | 1년      | 클라이언트 접근 가능 | 테마 설정                                              |
| `app_jwt` | Cookie         | 7일      | 클라이언트 접근 불가 | 로그인 성공 시 생성되는 JWT 세션 토큰. 로그아웃시 삭제 |
| `sigForm` | SessionStorage | 세션종료 | 클라이언트 접근 가능 | SIG 생성 폼 임시저장                                   |
| `pigForm` | SessionStorage | 세션종료 | 클라이언트 접근 가능 | PIG 생성 폼 임시저장                                   |

---

## ⚙️ CI: Continuous Integration

### build.yml

- **트리거:** `push` (main), `pull_request` (develop)
- **환경:** Node 20
- **단계:**
  1. `npm ci`
  2. `npm run build`
- **캐시:** npm
- **결과:** 빌드 성공 시 배포 트리거

### lint.yml

- **트리거:** `pull_request`
- **검증:**
  ```bash
  npm run lint --max-warnings=0
  ```
- **정책:** 오류 발생 시 PR 자동 실패

---

## 주요 기술 스택

- **Next.js 14 (App Router)**
- **React 18**, TypeScript
- **Zustand**: 상태 관리
- **CSS Modules**
- **ESLint + Prettier**
