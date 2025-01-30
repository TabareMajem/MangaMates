import { RateLimiter } from '@/lib/security/rate-limiter';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { Redis } from '@upstash/redis';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();
const limiter = new RateLimiter(redis);

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  await supabase.auth.getSession();

  // Skip rate limiting for static assets
  if (req.nextUrl.pathname.startsWith('/_next')) {
    return res;
  }

  const ip = req.ip ?? 'anonymous';
  const { success, limit, remaining, reset } = await limiter.check(ip);

  if (!success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    });
  }

  const response = res;
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());

  // Security Headers
  const headers = response.headers;
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('Content-Security-Policy', generateCSP());

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
