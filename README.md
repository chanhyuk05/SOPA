# 합주실 예약 시스템

Atomic Design Pattern을 적용한 React Native Expo 합주실 예약 앱입니다.

## � 주요 기능

### 🎯 기본 예약 시스템
- **아침 합주실 예약**: 전날 오후 4:30에 예약 창 오픈
- **당일 점심 및 방과후 예약**: 당일 오전 8:10에 예약 창 오픈
- **학번 및 이름 필수 입력**: 5자리 학번으로 신원 확인
- **방과후 시간 제한**: 하루 1시간만 예약 가능 (아침, 점심은 중복 가능)

### ⏰ 자동 스케줄링
- **주간 정리**: 매주 금요일 오후 12시에 금요일 방과후를 제외한 모든 예약 삭제
- **금요일 방과후 정리**: 토요일에 금요일 방과후 예약 삭제
- **실시간 예약 창 관리**: 정해진 시간에 자동으로 예약 창 오픈/클로즈

### 👥 학년별 우선순위 시스템
- **월요일 아침 (금요일 4:30)**: 2학년 우선, 다른 학년은 4:40부터
- **수요일 아침 (화요일 4:30)**: 3학년 우선, 다른 학년은 4:40부터  
- **금요일 아침 (목요일 4:30)**: 1학년 우선, 다른 학년은 4:40부터

### 🔐 관리자 시스템
- **총관리자** (과대, 학과장): 모든 권한, 시간 제약 없이 예약/취소 가능
- **부관리자** (강사): 시간 제약 없이 예약 가능
- **학생**: 기본 예약 규칙 적용

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
