import { type NextRequest } from 'next/server';
import { logtoClient } from '@/utils/auth';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  return logtoClient.handleSignIn()(request);
}