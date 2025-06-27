# InitFrontend

Next.js App Router 기반으로 구축되었으며, 사용자 인증, SIG 생성, 게시판 등 다양한 기능을 지원합니다.

---

## 주요 폴더

```
## 파일 구조 및 페이지 설명

```

src/
└── app/
├── about/
│ ├── developers/ # 개발자 소개 페이지
│ ├── executives/ # 운영진 소개 페이지
│ ├── my-page/ # 내 정보 페이지
│ ├── rules/ # 회칙 페이지 : 마크다운 파일을 불러와서 띄움
│ └── page.jsx # SCSC 소개 메인 페이지
├── article/[id]/ # 게시글 상세 페이지
├── board/[id]/ # 게시글 목록 페이지(게시글 별 id로 접속)
│ └── create/ # 새 글 작성 페이지
├── executive/ # 운영진 전용 관리 페이지
├── pig/
│ ├── [id]/ # 개별 PIG 상세 페이지
│ ├── create/ # 새 PIG 생성 페이지
│ ├── PigCreateButton.jsx # PIG 생성 버튼
│ └── page.jsx # 전체 PIG 목록 페이지
├── sig/
│ ├── [id]/ # 개별 SIG 상세 페이지
│ ├── create/ # SIG 생성 페이지
│ ├── SigCreateButton.jsx # SIG 생성 버튼
│ └── page.jsx # 전체 SIG 목록 페이지
└── us/
│ └── (auth)/login/ # 로그인 + 회원가입 페이지 : 로그인 시도 후 db에 없으면 회원가입 진행
│ ├── validator.jsx # 회원가입 사용자 데이터 형식 검사
│ └── contact # 연락처 및 회원가입 링크

````
---

## 설치 및 실행 방법

### 1. 레포지토리 클론

```bash
git clone https://github.com/scsc-init/homepage_init_frontend.git
````

### 2. 패키지 설치

```bash
npm install
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
