import { codeToHtml } from 'shiki';

/** astro.config.mjs rehype-pretty-code와 동일한 테마 */
export const CODE_THEMES = {
  light: 'github-light',
  dark: 'vesper',
} as const;

export async function highlightCode(code: string, lang = 'js'): Promise<string> {
  return codeToHtml(code.trim(), {
    lang,
    themes: CODE_THEMES,
    defaultColor: false,
  });
}
