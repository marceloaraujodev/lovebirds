import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  // Try to read the locale from cookies (set in the middleware)
 // Read the locale from the cookie
 const cookieStore = await cookies();
 const localeFromCookie = cookieStore.get('NEXT_LOCALE')?.value || 'pt'; // Fallback to 'pt'
 const locale = localeFromCookie;

 
  // Dynamically load the appropriate messages file based on the locale
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages
  };
});
