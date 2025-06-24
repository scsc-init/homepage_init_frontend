# InitFrontend

Next.js App Router 기반으로 구축되었으며, 사용자 인증, SIG 생성, 게시판 등 다양한 기능을 지원합니다.

---

## 주요 폴더

```
├── public/ #리소스
├── scripts/ #스크립트
├── src/
│   ├── app/
│   │   ├── (auth)/ #로그인, 회원가입
│   │   ├── boards/ #게시판(구현예정)
│   │   ├── intro/ #소개페이지. 헤더의 SCSC 메뉴
│   │   ├── my-page/ #마이페이지
│   │   ├── sig/ #sig 목록. sig/create는 시그 생성
│   │   ├── favicon.ico
│   │   ├── footer.css
│   │   ├── footer.tsx #수정 예정
│   │   ├── global.css #전체 css
│   │   ├── header.css #헤더
│   │   ├── header.jsx #헤더
│   │   ├── layout.tsx #레이아웃
│   │   ├── page.css
│   │   ├── page.jsx #메인페이지.
│   │   └── page.tsx
│   ├── components/ #component. ***현재 intro 페이지의 componentization이 덜 되었습니다.
│   ├── data/
│   ├── interfaces/
│   ├── state/
│   └── util/
│       ├── extractProps.tsx
│       ├── joinClassName.tsx
│       ├── navigation.tsx
│       ├── setAction.ts
│       └── sleep.ts
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── README.md
├── next.config.mjs
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── test.js
└── tsconfig.json
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
├── public/ #리소스
├── scripts/ #스크립트
├── src/
│   ├── app/
│   │   ├── (auth)/ #로그인, 회원가입
│   │   ├── boards/ #게시판(구현예정)
│   │   ├── intro/ #소개페이지. 헤더의 SCSC 메뉴
│   │   ├── my-page/ #마이페이지
│   │   ├── sig/ #sig 목록. sig/create는 시그 생성
│   │   ├── favicon.ico
│   │   ├── footer.css
│   │   ├── footer.tsx #수정 예정
│   │   ├── global.css #전체 css
│   │   ├── header.css #헤더
│   │   ├── header.jsx #헤더
│   │   ├── layout.tsx #레이아웃
│   │   ├── page.css
│   │   ├── page.jsx #메인페이지.
│   │   └── page.tsx
│   ├── components/ #component. ***현재 intro 페이지의 componentization이 덜 되었습니다.
│   ├── data/
│   ├── interfaces/
│   ├── state/
│   └── util/
│       ├── extractProps.tsx
│       ├── joinClassName.tsx
│       ├── navigation.tsx
│       ├── setAction.ts
│       └── sleep.ts
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── README.md
├── next.config.mjs
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── test.js
└── tsconfig.json
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
npm install react-markdown #회칙 페이지와 게시판 페이지에 사용하려고 합니다.
npm install react-markdown remark-gfm rehype-highlight highlight.js
npm install rehype-raw

```

### 3. 개발 서버 실행

```bash
npm run dev
```

접속: [http://localhost:3000](http://localhost:3000)

---

## 주요 기술 스택

- **Next.js 14** (App Router)
- **React 18**, TypeScript
- **Zustand**: 상태 관리
- **CSS Modules**
- **ESLint + Prettier**
