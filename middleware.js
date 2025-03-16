// middleware.ts
import { NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'pt'];
const defaultLocale = 'pt';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip API/static files
  if (pathname.includes('/api/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Extract the first part of the pathname (could be a locale)
  const pathSegments = pathname.split('/');
  const potentialLocale = pathSegments[1]; // First segment after "/" ['', 'pt', 'about']

  // If pathname already has a valid locale, continue without redirect - if /en we just set the cookie for that
  if (locales.includes(potentialLocale)) {
    // Set the locale cookie to match the current URL
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', potentialLocale, { path: '/' });
    return response;
  }

  const detectedLocale = detectBrowserLocale(request);

  // Sets locale routing - Redirect root (`/`) to default locale (`/pt`)
  const newPathname = `/${detectedLocale}${pathname}`; // pt/about -> about pathname
  const newUrl = new URL(newPathname, request.url);

  // Set a cookie with the resolved locale
  const response = NextResponse.redirect(newUrl);
  response.cookies.set('NEXT_LOCALE', defaultLocale, { path: '/' });

  console.log('Redirecting to:', newUrl.toString());
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

function detectBrowserLocale(request) {
    // Detect browser's preferred language for loading the language translations i18n
    const headers = new Headers(request.headers);
    const acceptLanguage = headers.get('accept-language') || '';
    const negotiator = new Negotiator({ headers: { 'accept-language': acceptLanguage } });
    return match(negotiator.languages(), locales, defaultLocale);
}