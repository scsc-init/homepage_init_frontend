# 인증 및 토큰 구조 문서

> 최초작성일: 2026-02-28  
> 최신개정일: 2026-02-28  
> 작성자 : 박성현
> 최신개정자 : 박성현

---

# 1. 개요

본 문서는 현재 시스템의 인증 구조 및 토큰 형식을 명확히 정의한다.

본 문서는 다음 사항을 정리한다.

- Backend JWT 형식
- 로그인 인증 흐름
- 요청 시 토큰 전달 방식
- 권한 검증 방식
- Executive 경로 보호 방식

---

# 2. 전체 인증 구조 개요

현재 시스템은 다음과 같은 2계층 인증 구조를 사용한다.

1.  Google OAuth (사용자 신원 확인)
2.  Backend JWT (애플리케이션 권한 인증)

Frontend는 NextAuth를 사용하여 세션을 유지하지만, 실제 API 접근 권한
판단은 Backend JWT를 기준으로 한다.

---

# 3. 로그인 흐름

## 3.1 로그인 엔드포인트

POST /api/user/login

## 3.2 필수 헤더

x-api-secret: `<server_secret>`{=html}

## 3.3 요청 Body

{ "email": "user@example.com", "hashToken":
"`<sha256_hmac_of_email>`{=html}" }

## 3.4 응답

{ "jwt": "`<backend_jwt>`{=html}" }

발급된 JWT는 프론트엔드 세션에 저장되며 이후 모든 Backend 요청에
사용된다.

---

# 4. Backend JWT 명세

## 4.1 서명 알고리즘

HS256 (HMAC-SHA256)

서명 키: settings.jwt_secret

## 4.2 JWT Header

{ "alg": "HS256", "typ": "JWT" }

## 4.3 JWT Payload

{ "user_id": "`<user_primary_key>`{=html}", "exp":
"`<unix_timestamp>`{=html}" }

## 4.4 필수 Claim

| Claim   | 타입   | 필수여부 | 설명             |
| ------- | ------ | -------- | ---------------- |
| user_id | string | 필수     | User 테이블의 PK |
| exp     | int    | 필수     | 만료 시각        |

JWT 만료 시간은 다음 설정값에 의해 결정된다:

settings.jwt_valid_seconds

만료된 토큰은 자동으로 인증 실패 처리된다.

---

# 5. 토큰 전달 방식

## 5.1 인증 헤더

모든 인증된 Backend 요청은 다음 헤더를 포함해야 한다.

x-jwt: `<backend_jwt>`{=html}

주의: Authorization: Bearer 형식은 사용하지 않는다.

## 5.2 x-api-secret 사용 구간

다음 엔드포인트는 추가적으로 x-api-secret 헤더를 요구한다.

- /api/user/login
- /api/user/create

헤더:

x-api-secret: `<server_secret>`{=html}

---

# 6. 요청 처리 시 사용자 해석 절차

각 요청 처리 흐름:

1.  x-jwt 헤더 추출
2.  HS256 방식으로 서명 검증
3.  user_id, exp Claim 필수 검증
4.  exp 만료 검증
5.  user_id 기반으로 DB에서 사용자 조회
6.  요청 컨텍스트에 사용자 객체 주입

위 과정 중 하나라도 실패 시 401 Unauthorized 반환

---

# 7. 권한 체계 (Role 기반 접근 제어)

권한은 DB에 저장된 role 값을 기준으로 판단한다.

권한 레벨은 다음과 같이 정의되어 있다:

0 : lowest\
100 : dormant\
200 : newcomer\
300 : member\
400 : oldboy\
500 : executive\
1000 : president

권한 판별은 다음 함수로 수행된다:

get_user_role_level(role_name)

---

# 8. Executive API 보호 정책

다음 경로는 운영진 이상 권한이 필요하다.

/api/executive/\*

접근 조건:

user.role \>= executive

조건을 만족하지 않을 경우 403 반환

해당 보호는 Middleware 레벨에서 수행된다.

---

# 9. 프론트엔드 연동 구조

Frontend는 NextAuth JWT 전략을 사용한다.

Backend에서 발급된 JWT는 NextAuth 토큰 내부의:

backendJwt

필드에 저장된다.

Next.js 서버 API Wrapper는 해당 값을 읽어 Backend 요청 시 x-jwt 헤더에
포함하여 전달한다.

브라우저는 자동으로 backendJwt를 Backend에 직접 전송하지 않는다.

---
