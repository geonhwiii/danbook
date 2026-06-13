/** 사이트 전역 메타 */
export const siteName = '단북';
export const siteTagline = '공부한 내용을 차곡차곡 쌓는 학습 문서';
export const siteDescription = '직접 공부하며 정리한 내용을 학습에 도움이 되도록 정리한 문서 사이트.';

/** 헤더 상단 탭 */
export const headerTabs = [{ label: '학습', href: '/docs' }] as const;

/**
 * 강의(course) 레지스트리.
 * - slug: content/docs/<slug>/ 디렉터리 이름과 일치해야 한다.
 * - categoryOrder: 강의 내부 사이드바 그룹의 표시 순서.
 */
export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  categoryOrder: string[];
};

export const courses: Course[] = [
  {
    slug: 'networking-for-web-developers',
    title: '웹 개발자를 위한 네트워크',
    subtitle: 'ping 한 줄에서 인터넷 전체까지',
    description:
      'ping 한 줄에서 출발해 인터넷 전체를 손으로 따라가며 계층을 파악하는 강의입니다. printf·netcat·tcpdump·traceroute 같은 도구로 직접 확인하며 익힙니다.',
    categoryOrder: ['네트워크 기초', '네트워크 심화'],
  },
];

export const courseBySlug = (slug: string) => courses.find((c) => c.slug === slug);

/** 랜딩 — 자주 다루는 주제 */
export const topics = [
  'TCP/IP',
  'HTTP',
  'DNS',
  'CIDR · 서브넷',
  'NAT · IPv6',
  '라우팅',
  'TCP 핸드셰이크',
  '대역폭 · 지연',
];
