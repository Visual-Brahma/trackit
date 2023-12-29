import environmentVariables from '@/config/environment';
import { type LogtoContext } from '@logto/next';
import { cookies } from 'next/headers';

// `server-only` guarantees any modules that import code in file
// will never run on the client. Even though this particular api
// doesn't currently use sensitive environment variables, it's
// good practise to add `server-only` preemptively.

// eslint-disable-next-line import/no-unassigned-import
import 'server-only';

export async function getUser(reqCookies?: string): Promise<LogtoContext|null> {
  const response=await fetch(`${environmentVariables.baseUrl}/api/logto/user`, {
    cache: 'no-store',
    headers: {
      // cookie: reqCookies||cookies().toString(),
      cookie: cookies().toString(),
    },
  });

  if (!response.ok) {
    // throw new Error('Something went wrong!');
    return null;
  }

  // eslint-disable-next-line no-restricted-syntax
  const user=(await response.json()) as LogtoContext;

  return user;
}