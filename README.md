# React + TypeScript + Vite <br/>
https://dashboard-samples.netlify.app/
<br/>

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## mes-react-vite
본 프로젝트는 React 19와 Vite 7을 기반으로 한 고성능 엔지니어링 실행 시스템(EES) 프런트엔드 솔루션을 위한 샘플입니다. <br/>
대용량 데이터 처리와 실시간 시각화에 최적화된 아키텍처로 구성되어 있습니다.<br/>
next.js를 사용하지 않는 대신 vite 를 사용한 이유는 압도적인 개발 및 빌드 속도, 아키텍처의 단순화, 호스팅 및 배포 전략의 경제성, 기술 스택 종속성 해소 를 위해서 제거했습니다.<br/>

## Nexus를 통한 배포 과정에서 필요한 빌드 파일의 버전 관리를 위한 빌드 명령어.
- package.json 파일이 자동으로 저장

 npm version patch: 1.0.1 → 1.0.2 (단순 버그 수정, 소소한 변경)

 npm version minor: 1.0.1 → 1.1.0 (새로운 기능 추가)

 npm version major: 1.0.1 → 2.0.0 (대규모 개편, 호환성 깨짐)

 npm run release: patch 버전 숫자가 1.0.1에서 1.0.2로 올라가고 그 상태로 빌드가 돌아간다

 npm run package: 현재 기준 패키징 파일로 dist 폴더 하위 내용을 .tar 로 압축 생성한다.

 최종적으로 script 내부 코드 수정, release 명령어 한번으로 선행 내용 모두 끝낸다.

 수정 된 script 기반으로 npm run release: 최종적으로 버전업 > 빌드 > 압축까지 한번에 진행.
<br/>

## Tech Stack (commit 기준)
Core Framework & Language
React 19: 최신 리액트 기능을 활용한 UI 렌더링

TypeScript 5.9: 엄격한 타입 체크를 통한 코드 안정성 확보

Vite 7.3: 초고속 빌드 및 HMR 환경 제공

React Router Dom 7.1: 선언적 라우팅 관리

Data Grid & Large Dataset Handling
AG Grid Community 35.1: 복잡한 데이터 조작 및 필터링을 위한 엔터프라이즈급 그리드

TanStack Table 8.21: Headless 구조의 유연한 커스텀 테이블 구현

TanStack Virtual 3.13: 수만 건의 로우를 성능 저하 없이 렌더링하는 가상 스크롤 기술

State Management & Data Fetching
Zustand 5.0: 설비 상태 및 전역 UI 설정을 관리하는 경량 상태 관리 도구

TanStack Query 5.90: 서버 데이터 캐싱, 동기화 및 비동기 상태 관리

Axios 1.13: 안정적인 HTTP 비동기 통신 클라이언트

Visualization (Charts)
LightningChart JS (@arction/lcjs) 5.2: 실시간 고속 데이터 스트리밍 및 정밀 SPC 차트 (GPU 가속)

Recharts 3.7 / Chart.js 4.5: 직관적인 통계 데이터 및 대시보드 시각화

Styling & Icons
Tailwind CSS 4.2: Utility-first 기반의 신속한 UI 개발 및 디자인 일관성 유지

Lucide React: 대시보드 인터페이스용 경량 아이콘 에셋<br/>

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
