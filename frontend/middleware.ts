import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Refresh the session when Supabase auth is configured and a request reaches
  // the app. The current login flow remains backed by the FastAPI JWT API.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
