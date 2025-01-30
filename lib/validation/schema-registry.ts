import { z } from 'zod';

export class SchemaRegistry {
  private static instance: SchemaRegistry;
  private schemas: Map<string, z.ZodSchema> = new Map();

  private constructor() {
    this.registerDefaultSchemas();
  }

  static getInstance(): SchemaRegistry {
    if (!SchemaRegistry.instance) {
      SchemaRegistry.instance = new SchemaRegistry();
    }
    return SchemaRegistry.instance;
  }

  registerSchema(name: string, schema: z.ZodSchema) {
    this.schemas.set(name, schema);
  }

  getSchema(name: string): z.ZodSchema | undefined {
    return this.schemas.get(name);
  }

  async validate<T>(schemaName: string, data: unknown): Promise<{ 
    success: boolean; 
    data?: T; 
    errors?: z.ZodError 
  }> {
    const schema = this.schemas.get(schemaName);
    if (!schema) {
      throw new Error(`Schema ${schemaName} not found`);
    }

    try {
      const validatedData = await schema.parseAsync(data);
      return { success: true, data: validatedData as T };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, errors: error };
      }
      throw error;
    }
  }

  private registerDefaultSchemas() {
    // User Schema
    this.registerSchema('user', z.object({
      email: z.string().email(),
      name: z.string().min(2).max(100),
      role: z.enum(['user', 'admin']).default('user'),
      settings: z.object({
        theme: z.enum(['light', 'dark']).default('light'),
        notifications: z.boolean().default(true)
      }).optional()
    }));

    // Journal Entry Schema
    this.registerSchema('journalEntry', z.object({
      userId: z.string().uuid(),
      content: z.string().min(1).max(50000),
      mood: z.enum(['happy', 'sad', 'neutral', 'angry', 'anxious']).optional(),
      tags: z.array(z.string()).max(10).optional(),
      metadata: z.record(z.unknown()).optional()
    }));

    // Analytics Event Schema
    this.registerSchema('analyticsEvent', z.object({
      userId: z.string().uuid(),
      eventType: z.string(),
      timestamp: z.date(),
      data: z.record(z.unknown())
    }));
  }
}
