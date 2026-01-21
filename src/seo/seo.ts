import { config } from '@/config';

export const SITE_ORIGIN = 'https://tools.hongqiangnet.com';
export const SITE_NAME = '常用工具网';
export const DEFAULT_OG_IMAGE_URL = `${SITE_ORIGIN}/banner.png`;
export const OG_LOCALE = 'zh_CN';

export function getCanonicalPath(routePath: string): string {
  const baseUrl = config.app.baseUrl ?? '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = routePath.startsWith('/') ? routePath : `/${routePath}`;

  if (normalizedBase === '' || normalizedBase === '/') {
    return normalizedPath;
  }

  return `${normalizedBase}${normalizedPath}`;
}

export function getCanonicalUrl(routePath: string): string {
  return new URL(getCanonicalPath(routePath), SITE_ORIGIN).toString();
}
