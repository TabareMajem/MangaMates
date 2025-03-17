import { z } from 'zod';

export class SchemaValidator {
  private schemas: Map<string, z.ZodSchema> = new Map();

  registerSchema(name: string, schema: z.ZodSchema) {
    this.schemas.set(name, schema);
  }

  async validate<T>(schemaName: string, data: unknown): Promise<T> {
    const schema = this.schemas.get(schemaName);
    if (!schema) {
      throw new Error(`Schema ${schemaName} not found`);
    }

    return schema.parse(data) as T;
  }
}
