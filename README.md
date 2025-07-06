# InitFrontend

Next.js App Router 기반으로 구축되었으며, 사용자 인증, SIG 생성, 게시판 등 다양한 기능을 지원합니다.

---

## `.env.local` 설정

아래 내용을 `.env.local` 파일에 복사해서 넣어주세요:

```env
BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
API_SECRET=some-secret-code
NEXT_PUBLIC_API_SECRET=some-secret-code
```

백엔드의 .env 파일은 저기에 맞춰서 작성하시면 됩니다. 제가 작성한 내용은 이렇습니다.

```
API_SECRET="some-secret-code"
JWT_SECRET="some-jwt-secret"
JWT_VALID_SECONDS=3600
SQLITE_FILENAME="test.db"
IMAGE_DIR=./uploaded_images
IMAGE_MAX_SIZE=5242880
FILE_DIR=./uploaded_files
FILE_MAX_SIZE=10485760
ARTICLE_DIR=./articles
USER_CHECK=TRUE
ENROLLMENT_FEE=300000
CORS_ALL_ACCEPT=true

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

## 설치 및 실행 방법

### 1. 레포지토리 클론

```bash
git clone https://github.com/scsc-init/homepage_init_frontend.git
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

접속: [http://localhost:3000](http://localhost:3000)

---

## 주요 기술 스택

- **Next.js 14 (App Router)**
- **React 18**, TypeScript
- **Zustand**: 상태 관리
- **CSS Modules**
- **ESLint + Prettier**
