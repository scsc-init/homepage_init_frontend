# SCSC Frontend 배포 메뉴얼 (Dockerfile + docker run, nginx, 80 Port)

본 문서는 **SCSC Frontend(Next.js)** 를 동방 서버에서 **80 포트(HTTP)** 로 서비스하기 위한 배포 메뉴얼입니다.

> 작성일: 2025-12-29
>
> 최신개정일 : 2026-01-01
>
> 작성자 : 이한경 윤영우 [강명석](mailto: tomskang@naver.com) 박성현
>
> 최신개정자 : [박성현](mailto: coshaman@snu.ac.kr)

- 서버 IP: `147.46.102.118`
- SSH 포트: `77`
- 사용자: `owner`
- 외부 공개 포트: `80`
- Frontend 내부 포트(호스트 loopback): `127.0.0.1:3000`
- Frontend 경로: `~/scsc-init/frontend`

---

## 1. 아키텍처

```text
[ Client ]
   |
   | 80/tcp
   v
[ nginx (host) ]
   |
   +--> Frontend (Next.js in Docker) : 127.0.0.1:3000
```

- nginx는 **호스트에서 실행**
- Frontend는 **Docker 컨테이너로 실행**
- 외부에는 **80 포트만 노출**, 3000은 `127.0.0.1`에만 바인딩

---

## 2. 서버 접속

```bash
ssh -p 77 owner@147.46.102.118
```

---

## 3. Docker 설치 확인/설치

### 3.1 설치 확인

```bash
docker --version
```

### 3.2 설치 (Debian/Ubuntu 기준)

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
```

---

## 4. Frontend 이미지 빌드 (Dockerfile)

> 경로: `~/scsc-init/frontend/Dockerfile`  
> Dockerfile 내부에서 `npm ci` → `npm run build` 후 `npm run start`로 실행합니다.

### 4.1 Frontend 디렉토리로 이동

```bash
cd ~/scsc-init/frontend
```

### 4.2 Dockerfile 확인(선택)

```bash
sed -n '1,220p' Dockerfile
```

### 4.3 이미지 빌드

```bash
docker build -t scsc-frontend:latest .
```

---

## 5. 컨테이너 실행 (docker run)

### 5.1 환경변수 파일 준비

- 운영에서는 `.env.local` 대신 `.env.production` 을 사용합니다.
- README를 참고해 env를 작성합니다.

확인:

```bash
cd ~/scsc-init/frontend
ls -lah .env.production
```

권장 권한:

```bash
chmod 600 .env.production
```

### 5.2 기존 컨테이너 정리 (안전)

```bash
docker stop scsc-frontend 2>/dev/null || true
docker rm scsc-frontend 2>/dev/null || true
```

### 5.3 실행 (127.0.0.1:3000만 바인딩)

```bash
cd ~/scsc-init/frontend
docker run -d \
  --name scsc-frontend \
  --restart unless-stopped \
  --env-file ./.env.production \
  -p 127.0.0.1:3000:3000 \
  scsc-frontend:latest
```

### 5.4 컨테이너 상태/응답 확인

```bash
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
curl -I -m 3 http://127.0.0.1:3000/ | head -n 20
```

---

## 6. nginx 설정 (BE MSA 스타일: upstream + location /api + location /)

> nginx는 호스트에서 실행합니다.

### 6.1 설정 테스트 및 재시작

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 7. 배포 검증(포트 개방 검사 증빙)

### 7.1 80 포트 리슨 확인

```bash
sudo ss -lntp | grep ':80'
```

### 7.2 외부 응답 확인

```bash
curl -I http://147.46.102.118/
curl -I http://147.46.102.118/ | egrep 'HTTP/|Server|X-Powered-By'
```

정상 예시:

- `HTTP/1.1 200 OK`
- `Server: nginx/...`
- `X-Powered-By: Next.js`

### 7.3 로그 확인

```bash
sudo tail -n 100 /var/log/nginx/access.log
sudo tail -n 100 /var/log/nginx/error.log
docker logs --tail=200 scsc-frontend
```

---

## 8. 업데이트

```bash
cd ~/scsc-init/frontend
git pull --ff-only

docker build -t scsc-frontend:latest .

docker stop scsc-frontend 2>/dev/null || true
docker rm scsc-frontend 2>/dev/null || true

docker run -d \
  --name scsc-frontend \
  --restart unless-stopped \
  --env-file ./.env.production \
  -p 127.0.0.1:3000:3000 \
  scsc-frontend:latest
```

---
