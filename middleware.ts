import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { redis } from './lib/redis';

// Rate limiting configuration
const RATE_LIMIT_REQUESTS = 100; // Number of requests
const RATE_LIMIT_WINDOW = 60; // Window in seconds

// Rate limiter function
async function rateLimit(ip: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const now = Math.floor(Date.now() / 1000);
  const window = Math.floor(now / RATE_LIMIT_WINDOW);
  const key = `rate-limit:${ip}:${window}`;
  
  try {
    // Remove old entries
    await redis.zremrangebyscore(key, 0, now - RATE_LIMIT_WINDOW);
    
    // Add current request
    await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` });
    
    // Set expiry for the key
    await redis.expire(key, RATE_LIMIT_WINDOW);
    
    // Count requests in current window
    const count = await redis.zcount(key, 0, now);
    
    return {
      success: count <= RATE_LIMIT_REQUESTS,
      limit: RATE_LIMIT_REQUESTS,
      remaining: Math.max(0, RATE_LIMIT_REQUESTS - count),
      reset: (window + 1) * RATE_LIMIT_WINDOW,
    };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // If Redis fails, allow the request
    return {
      success: true,
      limit: RATE_LIMIT_REQUESTS,
      remaining: RATE_LIMIT_REQUESTS,
      reset: now + RATE_LIMIT_WINDOW,
    };
  }
}

export async function middleware(request: NextRequest) {
  // Skip rate limiting for static assets
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Get IP address
  const ip = request.ip || '127.0.0.1';
  
  // Apply rate limiting
  const result = await rateLimit(ip);
  
  // If rate limit exceeded
  if (!result.success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
        'Retry-After': (result.reset - Math.floor(Date.now() / 1000)).toString(),
      },
    });
  }
  
  // Continue with the request
  const response = NextResponse.next();
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.reset.toString());
  
  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Apply to all paths except static assets and auth endpoints
    '/((?!_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
};
