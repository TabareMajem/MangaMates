import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '30s', target: 50 }, // Ramp up to 50 users
    { duration: '1m', target: 50 },  // Stay at 50 users
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

export default function () {
  const payload = JSON.stringify({
    platform: 'line',
    recipientId: `test-${__VU}-${__ITER}`,
    content: 'Load test message',
    type: 'text',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${__ENV.AUTH_TOKEN}`,
    },
  };

  const res = http.post(`${BASE_URL}/api/messages/send`, payload, params);

  check(res, {
    'status is 202': (r) => r.status === 202,
    'has message id': (r) => JSON.parse(r.body).messageId !== undefined,
  });

  sleep(1);
}
