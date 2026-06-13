import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // 사이드바 그룹 (예: "네트워크 기초"). shared/constants/site.ts의 categoryOrder와 매칭.
    category: z.string(),
    // 카테고리 안에서의 정렬 + 사이드바에 표시되는 번호.
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { docs };
