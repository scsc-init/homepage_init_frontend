# 개발 환경 설정 가이드 (신규 개발자용)

> 최초작성일: 2026-10-05  
> 최신개정일: 2026-10-05

---

# 1. 개요

본 문서는 SCSC init 홈페이지 개발에 새로 참여하는 사람이 **로컬에서 FE + BE를 실행하고, 관리자 권한 계정으로 로그인**하기까지의 과정을 순서대로 정리한다.

전체 흐름은 다음과 같다.

1. 필수 프로그램 설치
2. 저장소 clone
3. `.env` 파일 배치
4. Docker Desktop 설정
5. Backend / Frontend 실행
6. 계정 생성
7. pgAdmin에서 내 계정에 관리자 권한 부여
8. GitHub Organization 초대

> **Windows 사용자는 이후 모든 명령어를 Ubuntu(WSL) 터미널에서 실행한다.**  
> Windows PowerShell / CMD에서 실행하지 않도록 주의한다.

---

# 2. 필수 프로그램 설치

| 프로그램       | 비고                                  |
| -------------- | ------------------------------------- |
| WSL + Ubuntu   | **Windows 사용자만** 설치             |
| Docker Desktop | Backend(DB, pgAdmin 포함) 실행에 사용 |
| VSCode         | Windows 사용자는 `WSL` 확장 설치 권장 |
| Node.js        | **WSL(Ubuntu) 안에** 설치             |

Node.js는 Windows가 아닌 Ubuntu 안에 설치해야 한다. 예시:

```bash
# nvm 설치 (최신 설치 명령은 nvm README 참고)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source ~/.bashrc

# Node.js LTS 설치
nvm install --lts
node -v   # 버전이 출력되면 성공
```

---

# 3. 저장소 clone

Ubuntu 터미널을 열고, 작업할 폴더를 만든 뒤 FE / BE 저장소를 모두 clone 한다.

```bash
mkdir scsc          # 폴더 이름은 자유
cd scsc

git clone https://github.com/scsc-init/homepage_init_frontend.git
git clone https://github.com/scsc-init/homepage_init_backend.git
```

---

# 4. `.env` 파일 배치

`.env` 파일은 저장소에 포함되어 있지 않으므로 **기존 개발자에게 전달받는다.**

| 받은 파일   | 위치                                 |
| ----------- | ------------------------------------ |
| FE용 `.env` | `homepage_init_frontend/.env` (루트) |
| BE용 `.env` | `homepage_init_backend/.env` (루트)  |

> ⚠️ **FE `.env` 주의사항**  
> `localhost`가 들어간 URL은 **끝에 `/`가 없어야 한다.**
>
> - ✅ `http://localhost:8080`
> - ❌ `http://localhost:8080/`

---

# 5. Docker Desktop 설정

1. Docker Desktop을 실행한다.
2. (Windows) `Settings > Resources > WSL integration` 에서 **모든 항목(Ubuntu 포함)을 활성화**한 뒤 `Apply & restart`.
3. Ubuntu 터미널에서 아래 명령이 정상 출력되는지 확인한다.

```bash
docker -v
docker compose version
```

---

# 6. Backend / Frontend 실행

터미널(혹은 vscode 윈도우)을 2개 열어 각각 실행한다. (Windows는 둘 다 Ubuntu 터미널)

## 6.1 Backend

```bash
cd homepage_init_backend
docker compose up --build
```

로그가 멈추고 에러 없이 떠 있으면 성공이다. 이 터미널은 닫지 않는다.

## 6.2 Frontend

```bash
cd homepage_init_frontend
npm ci          # 최초 1회 (패키지 설치)
npm run dev
```

> `npm run dev`가 패키지 관련 에러로 실패하면 `npm ci`를 다시 실행한 뒤 재시도한다.

---

# 7. 계정 생성

1. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속
2. 회원가입을 진행해 **내 계정을 생성**한다.

생성 직후의 계정은 일반 권한 / 비활성 상태이므로, 다음 단계에서 관리자 권한을 부여한다.

---

# 8. pgAdmin에서 관리자 권한 부여

## 8.1 pgAdmin 로그인

[http://localhost:8085](http://localhost:8085) 접속 후 로그인한다.

| 항목     | 값                                 |
| -------- | ---------------------------------- |
| Email    | `admin@example.com`                |
| Password | BE `.env`의 `DB_ADMIN_PASSWORD` 값 |

## 8.2 DB 서버 등록

`Add New Server` 클릭 후 아래와 같이 입력하고 `Save`.

**General 탭**

| 항목 | 값   |
| ---- | ---- |
| Name | `db` |

**Connection 탭**

| 항목                 | 값                                                        |
| -------------------- | --------------------------------------------------------- |
| Host name/address    | `db`                                                      |
| Port                 | `5432`                                                    |
| Maintenance database | `postgres`                                                |
| Username             | `postgres`                                                |
| Password             | BE `.env`의 `DB_ADMIN_PASSWORD` 값 (예: `admin_password`) |

## 8.3 내 계정 권한 변경

1. 좌측 트리에서 아래 경로로 이동한다.

   ```txt
   Servers > db > Databases > main_db > Schemas > public > Tables > user
   ```

2. `user` 테이블 **우클릭 > View/Edit Data > All Rows**
3. 7단계에서 만든 내 계정 행을 찾아 다음 두 값을 수정한다.

   | 컬럼        | 변경 값 | 의미                   |
   | ----------- | ------- | ---------------------- |
   | `role`      | `1000`  | 회장(최고 관리자) 권한 |
   | `is_active` | `true`  | 활성 회원              |

4. 상단의 **Save Data Changes** (또는 `F6`) 를 눌러 저장한다.
5. [http://localhost:3000](http://localhost:3000) 에서 다시 로그인하면 관리자 기능을 사용할 수 있다.

---

# 9. GitHub Organization 초대

기존 운영진(Organization Owner)이 신규 개발자를 초대한다.

1. [scsc-init Organization](https://github.com/scsc-init) 접속
2. `People > Invite member` 에서 신규 개발자의 GitHub 계정 초대
3. 신규 개발자는 메일 또는 GitHub 알림에서 초대를 수락

초대 수락 후에는 [README](../README.md)의 브랜치 규칙에 따라 작업을 시작한다.

---

# 10. 자주 발생하는 문제

| 증상                                    | 확인할 것                                                        |
| --------------------------------------- | ---------------------------------------------------------------- |
| Ubuntu에서 `docker` 명령을 찾을 수 없음 | Docker Desktop 실행 여부, WSL integration 활성화 여부            |
| FE에서 API 요청이 실패함                | FE `.env`의 `localhost` URL 끝에 `/`가 붙어 있지 않은지          |
| `npm run dev` 실패                      | `npm ci` 재실행, `node -v`로 Ubuntu 안에 Node가 설치됐는지 확인  |
| pgAdmin에서 서버 연결 실패              | Host가 `localhost`가 아닌 **`db`** 인지, BE 컨테이너가 떠 있는지 |
| 권한을 바꿨는데 반영되지 않음           | pgAdmin에서 저장(F6)했는지, 로그아웃 후 다시 로그인했는지        |
