import { rest } from 'msw';

export const handlers = [
  rest.post('/api/messages/send', (req, res, ctx) => {
    return res(
      ctx.status(202),
      ctx.json({
        messageId: 'mock-message-id',
        status: 'queued'
      })
    );
  }),

  rest.get('/api/messages/:id/status', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.json({
        messageId: id,
        status: 'delivered',
        timestamp: Date.now()
      })
    );
  }),

  rest.post('https://kapi.kakao.com/v2/api/talk/message', (req, res, ctx) => {
    return res(
      ctx.json({
        result_code: 0,
        message_id: 'kakao-message-id'
      })
    );
  }),

  rest.post('https://api.line.me/v2/bot/message/push', (req, res, ctx) => {
    return res(
      ctx.json({
        message_id: 'line-message-id'
      })
    );
  })
];
