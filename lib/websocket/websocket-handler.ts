import { Logger } from '@/lib/monitoring/logger';
import { supabase } from '@/lib/supabase';
import { Redis } from '@upstash/redis';
import { Server as HttpServer } from 'http';
import { Server as WebSocketServer } from 'ws';

interface WebSocketMessage {
  type: string;
  payload: unknown;
}

export class WebSocketHandler {
  private wss: WebSocketServer;
  private redis: Redis;
  private logger: Logger;

  constructor(server: HttpServer) {
    this.wss = new WebSocketServer({ server });
    this.redis = Redis.fromEnv();
    this.logger = new Logger();

    this.setupWebSocket();
  }

  private setupWebSocket(): void {
    this.wss.on('connection', async (ws, req) => {
      try {
        // Authenticate connection
        const token = this.getAuthToken(req);
        if (!token) {
          ws.close(1008, 'Unauthorized');
          return;
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
          ws.close(1008, 'Unauthorized');
          return;
        }

        // Set up message handling
        ws.on('message', async (data) => {
          try {
            const message = JSON.parse(data.toString()) as WebSocketMessage;
            await this.handleMessage(message, user.id);
          } catch (error) {
            this.logger.error('WebSocket message handling error', error as Error);
          }
        });

        // Set up connection tracking
        const connectionId = this.generateConnectionId();
        await this.trackConnection(connectionId, user.id);

        ws.on('close', () => {
          this.removeConnection(connectionId, user.id).catch(error => {
            this.logger.error('Error removing WebSocket connection', error as Error);
          });
        });

      } catch (error) {
        this.logger.error('WebSocket connection error', error as Error);
        ws.close(1011, 'Internal Server Error');
      }
    });
  }

  private getAuthToken(req: any): string | null {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) return null;
    return auth.split(' ')[1];
  }

  private generateConnectionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async trackConnection(connectionId: string, userId: string): Promise<void> {
    await this.redis.hset(`ws:connections:${userId}`, {
      connectionId,
      timestamp: Date.now()
    });
  }

  private async removeConnection(connectionId: string, userId: string): Promise<void> {
    await this.redis.hdel(`ws:connections:${userId}`, connectionId);
  }

  private async handleMessage(message: WebSocketMessage, userId: string): Promise<void> {
    // Implement message handling logic
    this.logger.debug('Received WebSocket message', { userId, message });
  }

  broadcast(message: WebSocketMessage): void {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}
