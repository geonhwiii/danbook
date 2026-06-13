import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { courseBySlug } from '@shared/constants';

export type DocEntry = CollectionEntry<'docs'>;

/** id 예: "networking-for-web-developers/01-ping-to-http" */
export const courseSlugOf = (id: string) => id.split('/')[0] ?? '';
export const lessonSlugOf = (id: string) => id.split('/').slice(1).join('/');

/** 공개된(=draft 아님) 모든 레슨. */
export async function getLessons() {
  return getCollection('docs', ({ data }) => !data.draft);
}

/** 특정 강의(course)의 레슨들 — categoryOrder → order 순으로 평탄 정렬. */
export async function getCourseLessons(courseSlug: string) {
  const course = courseBySlug(courseSlug);
  const order = course?.categoryOrder ?? [];
  const catIndex = (c: string) => {
    const i = order.indexOf(c);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };

  return (await getLessons())
    .filter((doc) => courseSlugOf(doc.id) === courseSlug)
    .sort(
      (a, b) =>
        catIndex(a.data.category) - catIndex(b.data.category) ||
        a.data.category.localeCompare(b.data.category) ||
        a.data.order - b.data.order,
    );
}

/** 강의의 레슨을 그룹(category)별로 묶어 반환 — 사이드바/개요 페이지용. */
export async function getCourseGroups(courseSlug: string) {
  const lessons = await getCourseLessons(courseSlug);
  const grouped = new Map<string, DocEntry[]>();
  for (const lesson of lessons) {
    const list = grouped.get(lesson.data.category) ?? [];
    list.push(lesson);
    grouped.set(lesson.data.category, list);
  }
  return [...grouped.entries()].map(([category, items]) => ({ category, items }));
}
