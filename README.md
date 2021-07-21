# NEST.JS 중고거래 사이트
## Husky 사용법
```
npm run prepare
```
cmd 창에서 위 커맨드 실행


## 추가 파일
* eslint 탭 크기 2 및 룰 추가 적용
* 핫 리로딩 적용
* .env 적용
* logger 미들웨어 적용


* nest g mo (모듈명) : 모듈 생성
  * 폴더명은 복수로 하자
* nest g s (서비스명) : 서비스 생성
* nest g co (컨트롤러명) : 컨트롤러 생성

## dotenv 예시
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_DATABASE=shoppingmall
KAKAO_KEY=카카오키
COOKIE_SECRET=test
NAVER_CLIENT_ID=네이버 클라이언트 아이디
NAVER_CLIENT_SECRET=네이버 시크릿키
NAVER_CALLBACK_URL=http://localhost:4000/api/v1/users/auth/naver/callback
KAKAO_CALLBACK_URL=http://localhost:4000/api/v1/users/auth/kakao/callback
JWT_SECRET=JWT 비밀키
```