# 🎁 G-Wagon (지바겐) - 군인 가족을 위한 PX 대동여지도

> **"거기... 제가 들어가도 되는 마트인가요?"**
> 낯선 부대 앞에서 망설이는 군인 가족들을 위한, 가장 친절한 PX 지도 서비스입니다.

## 🌟 주요 기능 (Key Features)

### 1. 🚦 출입 가능 여부, 신호등으로 확인하세요

- **초록불(Green)**: 가족 출입 가능! (영외 마트)
- **노란불(Yellow)**: 확인 필요 (운영 시간/신분 확인 까다로움)
- **빨간불(Red)**: 영내 마트 (현역 장병 동행 필수)

### 2. 🚀 원터치 내비게이션

- 주소 복사? 필요 없습니다.
- 버튼 한 번만 누르면 **T맵, 네이버지도, 카카오내비**로 목적지가 바로 찍힙니다.

### 3. 📢 우리끼리 공유하는 실시간 정보

- "오늘 물건 들어왔나요?"
- 마트 반경 500m 이내에 있는 가족들이 **실시간 영업/재고 현황**을 알려줍니다.

### 4. 📱 앱 설치 없이 바로 사용 (PWA)

- 아이폰/갤럭시 모두 지원합니다.
- '홈 화면에 추가'를 하면 **진짜 앱처럼** 전체 화면으로 쓸 수 있습니다.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Maps**: Naver Maps, Kakao Maps
- **Backend**: Supabase (Auth, DB, RLS)
- **Deployment**: Vercel

## 🚀 시작하기 (Getting Started)

### 1. 프로젝트 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 키를 입력하세요.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_NAVER_CLIENT_ID=your_id
NEXT_PUBLIC_KAKAO_APP_KEY=your_key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

## 📜 라이선스

MIT License
