import type { APIRoute } from 'astro';
import { courses, courseBySlug } from '@shared/constants';
import { getCourseLessons, courseSlugOf } from '@lib/docs';

// Build-time search index: minimal lesson metadata, emitted as
// /search-index.json and fetched client-side by the search palette.
export const GET: APIRoute = async () => {
  const entries = [];
  for (const course of courses) {
    const lessons = await getCourseLessons(course.slug);
    for (const doc of lessons) {
      const c = courseBySlug(courseSlugOf(doc.id));
      entries.push({
        id: doc.id,
        title: doc.data.title,
        description: doc.data.description,
        category: doc.data.category,
        course: c?.title ?? course.slug,
      });
    }
  }

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json' },
  });
};
