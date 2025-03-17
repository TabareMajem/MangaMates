import { SchemaRegistry } from '@/lib/validation/schema-registry';
import { NextApiRequest, NextApiResponse } from 'next';

export function validateBody(schemaName: string) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const registry = SchemaRegistry.getInstance();
    
    try {
      const { success, data, errors } = await registry.validate(schemaName, req.body);
      
      if (!success) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors?.errors
        });
      }

      // Replace request body with validated data
      req.body = data;
      next();
    } catch (error) {
      return res.status(500).json({
        error: 'Validation System Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}
