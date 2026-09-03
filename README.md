# DROP - Backend Server

> **"지금 내 주변, 50m 안의 진짜 이야기"**
>
> DROP Server는 철저한 익명성을 바탕으로 **위치 기반(Location-Bounded)** 및 **휘발성(Time-Bomb)** 메시징을 제공하는 소셜 플랫폼의 백엔드 시스템입니다. 비즈니스 로직의 순수성을 보장하고 복잡한 도메인 규칙을 안전하게 수호하기 위해 **엄격한 헥사고날 아키텍처(Hexagonal Architecture)** 및 **도메인 주도 설계(DDD)** 원칙을 준수하여 설계되었습니다.

---

## Key Highlights

- **Modern Tech Stack**: NestJS, TypeScript, PostgreSQL (PostGIS), Prisma ORM, Redis.
- **Architecture**: Hexagonal Architecture (Ports and Adapters) + Domain-Driven Design (DDD).
- **Core Domain Rules**:
  - **Location-Bounded**: PostGIS(`ST_DWithin`) 공간 연산을 활용한 철저한 반경 50m 이내 데이터 접근 제어.
  - **Volatility**: 1/12/24시간 후 데이터가 흔적 없이 소멸하는 Time-Bomb 기능.
  - **Anonymity**: 닉네임 없는 100% 완전 익명성 보장 체계.

---

## Tech Stack & Libraries

| Category | Technology |
| --- | --- |
| **Language** | TypeScript |
| **Framework** | NestJS |
| **Architecture** | Hexagonal Architecture, Domain-Driven Design (DDD) |
| **Database** | PostgreSQL (PostGIS Extension) |
| **ORM** | Prisma ORM (v7 Driver Adapter - PrismaPg) |
| **In-Memory / Queue** | Redis (Time-Bomb TTL 처리 및 세션) |
| **Authentication** | JWT, Google OAuth2 |
| **Documentation** | Swagger (`@nestjs/swagger`) |

---

## Architecture & Module Strategy

DROP Server는 프레임워크나 외부 인프라(DB, 외부 API)에 비즈니스 로직이 종속되지 않도록 계층 간 결합도를 극도로 낮추고 도메인을 격리했습니다.

### Folder Structure (Ports and Adapters)
- **`domain/`**: 외부 의존성이 전혀 없는 순수한 비즈니스 룰과 도메인 엔티티 (상태 변경은 비즈니스 행위 메서드로만 수행).
- **`application/`**:
  - `port/in/`: 클라이언트(Web Adapter)가 비즈니스 로직을 호출하기 위한 인터페이스 명세 (UseCase).
  - `port/out/`: 비즈니스 로직이 외부 인프라(DB, Redis 등)와 통신하기 위한 인터페이스 명세.
  - `service/`: In-Port를 구현하며, 순수 도메인 객체를 조율하여 실제 비즈니스 유스케이스를 달성하는 계층 (단일 책임 원칙 준수).
- **`adapter/`**:
  - `in/web/`: HTTP 요청을 받아 검증하고 UseCase로 전달하는 Controller 및 Swagger DTO 계층.
  - `out/persistence/`: Out-Port를 구현하여 실제 DB와 통신. (Prisma가 완벽히 지원하지 않는 PostGIS 전용 공간 연산 Raw Query가 유일하게 허용 및 격리되는 계층).

---

## Engineering Standards (핵심 설계 원칙)

### 1. DTO & Validation Strictness
- **Definite Assignment & Optional**: 필수 필드는 명시적 할당(`!:`), 선택 필드는 Optional(`?:`)과 `@IsOptional()`을 강제하여 타입 안전성을 확보합니다.
- **Immutability (불변성)**: DTO 클래스의 모든 속성에 `readonly`를 강제하고, 객체 생성은 `private constructor`와 `static from()` 팩토리 메서드를 통해서만 제어합니다.
- **Geo-Spatial Validation**: 위치 데이터를 받는 DTO는 반드시 `@IsLatitude()`, `@IsLongitude()`로 엄격하게 검증합니다.

### 2. Service & UseCase (SRP & 순수 데이터 반환)
- **SRP 준수**: 기능별로 UseCase 인터페이스(In-Port)와 Service 구현체를 독립된 파일로 분리합니다.
- **순수 Result DTO**: UseCase의 반환 객체는 웹 계층이나 프레임워크에 종속되지 않는 순수 데이터 규격(`~Result`)을 사용합니다. 웹 계층 전용 API 응답(`~ResponseDto`)은 어댑터에서 팩토리 메서드로 변환합니다.

### 3. Domain Entity Isolation
- **은닉화 및 팩토리 패턴**: Entity 내부 상태를 변경하는 무분별한 `setter`를 금지하며, `static create()`, `static from()` 팩토리 메서드로 객체 생성을 캡슐화합니다.
- **Projection Data 분리**: `distance`나 투표 여부 등 조회 컨텍스트에 따라 달라지는 동적 데이터는 도메인의 고유 상태가 아니므로 `readonly`를 강제하여 오염을 막습니다.

### 4. Exception Handling
- **도메인 예외 분리**: 도메인/서비스 계층 내부에서는 NestJS 내장 HTTP 예외를 직접 던지지 않고, 비즈니스 의미가 명확한 커스텀 `DomainException`을 던집니다.
- **AllExceptionsFilter**: 던져진 순수 도메인 예외들을 글로벌 필터에서 감지하여 적절한 HTTP Status Code로 변환(Map)하는 책임을 독점하여 프레임워크 의존성을 제거합니다.

---

## How to Run

1. **Prerequisites**
    - Node.js (v18+ 권장)
    - PostgreSQL (PostGIS extension 설치 필수)
    - Redis

2. **Environment Setup**
    - 프로젝트 루트에 `.env` 파일을 생성하고 데이터베이스 연결 정보(`DATABASE_URL`) 및 Google OAuth 클라이언트 정보, JWT 시크릿 등을 설정합니다.

3. **Running the Server**
    ```bash
    # Install dependencies
    $ npm install

    # Prisma Client generate & DB Sync
    $ npx prisma generate
    $ npx prisma db push

    # Start local development server
    $ npm run start:dev
    ```
    - 로컬 API 서버 주소: `http://localhost:3000` 
    - Swagger API Docs: `http://localhost:3000/api-docs` (경로 설정에 따라 다를 수 있음)
