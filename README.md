# InitFrontend

Next.js **14** App Router 기반으로 구축된 SCSC init의 FE 코드입니다.

> 작성일: 2025-05-12
>
> 최신개정일 : 2026-05-15
>
> 작성자 : 이한경 윤영우 [강명석](mailto: tomskang@naver.com) 박성현
>
> 최신개정자 : [강명석](mailto: tomskang@naver.com)

## Branch Management

브랜치 관리는 **git flow**를 지향합니다.

- **main**: 배포용 브랜치입니다. 각 커밋에는 버전 태그(`vX.Y`)가 붙습니다. fast-forward merge 전용 protection 이 설정되어 있습니다.
- **develop (default)**: 개발 중인 코드입니다. feature PR은 develop으로 request 해야 하며 squash merge 전용입니다.

### 작업 브랜치 규칙

- 브랜치 이름은 `feature/` 접두어를 사용합니다.  
  e.g. `feature/sig-create`, `feature/fund-apply-fix`
- PR 제목에는 Gitmoji와 요약 문장을 사용합니다. 자세한 내용은 [PR template](https://github.com/scsc-init/homepage_init_frontend/blob/develop/.github/pull_request_template.md) 의 주석을 참고하세요.  
  e.g. `✨ SIG 생성 폼 검증 추가`
- PR 이 수정한 이슈가 있을 경우, 본문에는 반드시 해당 이슈를 `fix #123` 형태로 언급합니다.

```bash
git fetch
git checkout -b feature/<slug> origin/develop
# 작업...
git add .
git commit -m "..."
git push -u origin feature/<slug>
# → GitHub 에서 develop 브랜치로 PR 생성
```

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

## 환경 변수

| Key Name                   | Description                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| `BACKEND_URL`              | 연결된 BE 서버의 외부 URL                                                                   |
| `NEXT_PUBLIC_API_BASE_URL` | FE에서 사용하는 BE 서버의 외부 URL                                                          |
| `API_SECRET`               | BE 서버에서 처리되는 API KEY                                                                |
| `GOOGLE_CLIENT_ID`         | 구글 OAuth 애플리케이션으로 등록된 ID (하단의 `Google Auth 2.0 관리` 참조)                  |
| `GOOGLE_CLIENT_SECRET`     | 구글 OAuth 애플리케이션의 secret (하단의 `Google Auth 2.0 관리` 참조)                       |
| `NEXTAUTH_SECRET`          | NextAuth 에 사용될 secret, 임의로 생성함 (하단의 `next auth 설정` 참조)                     |
| `NEXTAUTH_URL`             | NextAuth 에 사용될 메인 URL, 프론트서버의 도메인 주소와 동일 (하단의 `next auth 설정` 참조) |
| `SNU_EMAIL_CHECK`          | 디버깅용. 구글 OAuth로 회원가입 시 snu 도메인인지 체크 여부                                 |
| `ENABLE_TEST_UTILS`        | 테스트 유틸리티 활성화 여부. TRUE로 설정했을 때만 활성화되며, 설정하지 않으면 비활성        |

## Install & Execute

### 1. 레포지토리 클론 및 패키지 설치

```bash
git clone https://github.com/scsc-init/homepage_init_frontend.git
cd homepage_init_frontend
npm ci
```

### 2. `.env.local` 설정

아래 내용을 `.env.local` 파일에 넣어주세요:

```env
BACKEND_URL=http://localhost:8080
API_SECRET=some-secret-code
GOOGLE_CLIENT_ID=구글_콘솔에서_받은_클라이언트_ID
GOOGLE_CLIENT_SECRET=구글_콘솔에서_받은_클라이언트_SECRET
NEXTAUTH_SECRET= openssl rand -base64 32 터미널에 입력해서 나온 값
NEXTAUTH_URL=https://your-domain.com (로컬에서는 http://localhost:3000)
SNU_EMAIL_CHECK=TRUE
```

Google OAuth, NextAuth 설정에 관한 자세한 설명은 다음 섹션을 참고하세요.

### 3. 개발 서버 실행

```bash
npm run dev
```

접속: [http://localhost:3000](http://localhost:3000)

- 상황에 따라, 벡엔드 서버 실행이 요구될 수 있습니다. 이 경우 [BE repository](https://github.com/scsc-init/homepage_init_backend) 또는 [MSA repository = BE+Bot](https://github.com/scsc-init/homepage_init_be_msa)의 `readme.md`를 참고하세요.

---

## Authentication: Google OAuth 2.0

**scsc 구글 계정 또는 공식 도메인이 변경될 경우 auth 관련 코드를 수정할 필요가 있습니다.**

- 원하는 계정으로 로그인 후 [Google Auth Client 패널](https://console.cloud.google.com/auth/clients)에 접속하세요.
- OAuth 2.0 Client IDs 항목에서 **+ Create Credentials** 클릭 후 웹 애플리케이션 유형으로 Client ID 를 생성하세요.
- Authorized redirect URIs를 입력하세요. *로그인 성공 후 사용자를 돌려보낼 주소*를 입력하면 됩니다.[^oauth]
- 발급된 Client ID 와 secret key 를 복사한 후, 하단의 `### next auth 설정`을 따르세요.

[^oauth]: 로컬 개발환경인 경우 `http://localhost:3000/api/auth/callback/google`를, 배포 환경인 경우 `https://(your-domain)/api/auth/callback/google`을 입력하면 됩니다.

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
3. 성공 시 BE에서 반환된 jwt를 nextauth session에 저장

---

## Configurations

### Lint & Prettier

본 레포지토리는 코드 스타일 통일과 가독성 개선을 위해 **`eslint`** 그리고 **`prettier`** 를 사용하고 있습니다.  
또한 동시에, 커밋 사전에 해당 linter 들이 자동 실행되도록 **`husky`**를 도입하여 사용하고 있습니다.  
관련된 파일들은 아래와 같습니다.

- `.prettierrc`: For prettier. 코드 포맷터입니다.
- `ESLint`: For eslint. React Hooks 규칙 강제, unused import 금지, import 정렬 적용에 사용합니다.
- `pre-commit`: For husky. 포맷 검증에 통과하지 못한 코드의 커밋을 방지합니다.

명령어를 실행해 사용해주세요. 등록을 강력히 권장합니다.

```bash
#1 Husky 설치(최초 1회)
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"

#2 포맷팅
npm run format         # Prettier로 전체 포맷 + ESLint 수정

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

- 주석 작성은 **`JSDoc`** 양식에 따르고 있습니다.
- 또한 동시에, a. 매우 큰 분기가 발생하는 부분이거나 b. 가독성이 비약적인 수준으로 향상 되지 않는 경우, 함수 내에서 주석을 작성하는 것을 지양합니다.

#### JSDoc 예시

```js
/**
 * @param {string} url Source image URL
 * @returns {string} URL with high-resolution parameters applied when applicable
 */
```

#### 사용하면 안 되는 주석 예시 (cursed)

```js
function doSomething(x, y) {
  try {
    // ...
  } catch (err) {
    // return success == fail when error occur
    return { success: false, error: err };
  }
}
```

에러 터졌을 때 success == false 인 object 를 반환한다는 사실은 코드만 읽어도 알 수 있습니다.  
코드에 미리 작성한 내용을 주석에 **다시** 작성하는 건 동어반복임.  
특히 AI-generated 코드가 이런 생산성 없는 주석을 작성하는 경우가 많은데, a. 유지보수에 도움이 안 되고 b. 쓸모없기 때문에 프로젝트 내에서는 삭제한 후 사용하도록 합니다.

## utils/constants.jsx

| Key                       | 예시 값                                   | 설명                                        |
| ------------------------- | ----------------------------------------- | ------------------------------------------- |
| `minExecutiveLevel`       | 500                                       | 운영진 권한 기준값                          |
| `oldboyLevel`             | 400                                       | 졸업생 권한                                 |
| `hideFooterRoutes`        | `['/', '/us/login', '/about/my-page']`    | 푸터를 숨길 라우트                          |
| `presidentEmails`         | `[sungjae0506@snu.ac.kr]`                 | 회장 이메일                                 |
| `excludedExecutiveEmails` | `[bot@discord.com, deposit.app@scsc.dev]` | 임원 목록에서 제외할 이메일                 |
| `COLORS`                  | `primary: 'var(--color-primary)'`         | 전체적인 색상 정의로, theme.css와 함께 수정 |

> **주의:** constants 변경 시 backend의 권한 상수와 일치해야 합니다.

## 🗝️ KV Table

본 레포지토리는 footer message 와 같은 런타임 환경 변수 관리를 위해, BE의 KV table 기능을 사용하고 있습니다.  
사용하고 있는 Key 값들은 아래와 같습니다.

| Key                        | 예시 값                                                                 | 설명                          | 형식   |
| -------------------------- | ----------------------------------------------------------------------- | ----------------------------- | ------ |
| `footer-message`           | 서울대학교 컴퓨터 연구회\n회장 한성재 010-5583-1811\nscsc.snu@gmail.com | 푸터 메시지                   | 문자열 |
| `main-president`           | id1                                                                     | 회장 사용자 id                | 문자열 |
| `vice-president`           | id2;id3                                                                 | `;`로 연결된 부회장 사용자 id | 문자열 |
| `TEXT_DEPOSIT_ACC`         | 국민은행 942902-02-054136 (강명석)                                      | 회비 입금 계좌 안내 문구      | 문자열 |
| `TEXT_DISCORD_INVITE_LINK` | https://discord.gg/SmXFDxA7XE                                           | 디스코드 초대 링크            | 문자열 |
| `TEXT_KAKAO_INVITE_LINK`   | https://invite.kakao.com/tc/II2yiLsQhY                                  | 카카오톡 오픈채팅 초대 링크   | 문자열 |

## Cookie & Storage

| Key       | Storage        | TTL      | 접근성               | 설명                 |
| --------- | -------------- | -------- | -------------------- | -------------------- |
| `theme`   | Cookie         | 1년      | 클라이언트 접근 가능 | 테마 설정            |
| `sigForm` | SessionStorage | 세션종료 | 클라이언트 접근 가능 | SIG 생성 폼 임시저장 |
| `pigForm` | SessionStorage | 세션종료 | 클라이언트 접근 가능 | PIG 생성 폼 임시저장 |

## CI: Continuous Integration

본 레포지토리는 GitHub Actions 를 사용하여 CI 를 자체적으로 관리하고 있습니다.  
[`.github/workflows`](https://github.com/scsc-init/homepage_init_frontend/tree/develop/.github/workflows) 폴더에서 모든 CI 항목을 확인할 수 있습니다.

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
  npm run lint
  ```
- **정책:** 오류 발생 시 PR 자동 실패

### 디스코드 웹훅 기능 명세서

**최신개정일:** 2025-11-24

**개요**

- 본 레포지토리는 PR에 대해 자동으로 디스코드에 알림을 받을 수 있도록 Github webhook 기능을 디스코드 채널과 연동해 사용하고 있습니다.
- 연동된 디스코드 채널은 SCSC 공식 디스코드 서버의 scsc_init_backend-pr입니다.
- Webhook 설정을 위해서는 레포지토리 소유자거나 운영진(admin) 권한을 소유해야 합니다.

**설정 방법**

1. 디스코드

- 웹훅을 추가하고자 하는 채널 선택 > settings > Integrations > Webhooks > New Webhook
- 웹 후크 URL 복사

2. 깃허브 레포 설정

- settings > Webhooks > Add webhook
- 복사한 URL을 붙여넣고 끝에 /github 추가
- Content type을 application/json으로 변경
- 적절한 트리거 이벤트 설정

**기능**

- PR 이벤트\*가 발생하면 메시지가 채널로 전송됩니다.

---

(\*) PR 이벤트는 다음을 의미합니다:

> Pull request assigned, auto merge disabled, auto merge enabled, closed, converted to draft, demilestoned, dequeued, edited, enqueued, labeled, locked, milestoned, opened, ready for review, reopened, review request removed, review requested, synchronized, unassigned, unlabeled, or unlocked.

---

## 주요 기술 스택

- **Next.js 14 (App Router)**
- **React 18**, TypeScript
- **Zustand**: 상태 관리
- **CSS Modules**
- **ESLint + Prettier**
