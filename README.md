# 단북 (danbook)

공부한 내용을 학습에 도움이 되도록 정리한 문서(docs) 사이트. danlog의 디자인·폰트를 그대로 유지한 채 docs 레이아웃으로 구성했습니다.

🔗 https://danbook.vercel.app

## 기술 스택

- **Astro** — 정적 사이트 생성, 콘텐츠 컬렉션 기반 문서
- **React** — 검색 팔레트 등 인터랙션 아일랜드
- **Tailwind CSS v4** — 디자인 토큰 기반 스타일링 (라이트/다크 테마)
- **MDX** + rehype-pretty-code — 마크다운 문서 작성, 코드 하이라이팅
- **bun** — 패키지 매니저 / 런타임
- **oxlint · oxfmt** — 린트 / 포매팅

## 명령어

| 명령어            | 설명                         |
| :---------------- | :--------------------------- |
| `bun install`     | 의존성 설치                  |
| `bun run dev`     | 개발 서버 (`localhost:4321`) |
| `bun run build`   | 프로덕션 빌드 (`./dist/`)    |
| `bun run preview` | 빌드 결과 로컬 미리보기      |
| `bun run lint`    | oxlint 검사                  |
| `bun run fmt:fix` | oxfmt 포매팅 적용            |

## 구조

```text
src/
├── components/        # DocsHeader · DocsSidebar · Footer + react/ (검색)
├── content/docs/      # 학습 문서 (Markdown / MDX)
├── layouts/           # Layout(공통 셸) · DocsLayout(헤더+사이드바+본문)
├── lib/               # 유틸 (markdown 헬퍼 등)
├── pages/             # 라우트 (랜딩, docs, robots.txt, search-index 등)
├── shared/constants/  # 사이트·사이드바·랜딩 콘텐츠 상수
└── styles/            # 전역 CSS / 디자인 토큰
```

## 문서 작성

`src/content/docs/<문서-slug>/index.md`(또는 `.mdx`)로 추가합니다. frontmatter:

```yaml
---
title: '제목'
description: '한 줄 설명'
category: '네트워크 기초' # shared/constants/site.ts의 categoryOrder와 매칭
order: 1 # 카테고리 안에서의 순서이자 사이드바 번호
---
```

카테고리 표시 순서는 `src/shared/constants/site.ts`의 `categoryOrder`에서 관리합니다.
