import { supabase } from '@/lib/supabase';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export class QueryBuilder<T> {
  private query: PostgrestFilterBuilder<any, any>;
  private shouldCache = false;
  private cacheKey: string | null = null;
  private cacheTTL = 3600; // 1 hour default

  constructor(table: string) {
    this.query = supabase.from(table).select();
  }

  select(columns: string): QueryBuilder<T> {
    this.query = this.query.select(columns);
    return this;
  }

  where(column: string, operator: string, value: any): QueryBuilder<T> {
    this.query = this.query.filter(column, operator, value);
    return this;
  }

  orderBy(column: string, ascending = true): QueryBuilder<T> {
    this.query = this.query.order(column, { ascending });
    return this;
  }

  limit(count: number): QueryBuilder<T> {
    this.query = this.query.limit(count);
    return this;
  }

  cache(key: string, ttl?: number): QueryBuilder<T> {
    this.shouldCache = true;
    this.cacheKey = key;
    if (ttl) this.cacheTTL = ttl;
    return this;
  }

  async execute(): Promise<T[]> {
    if (this.shouldCache && this.cacheKey) {
      const cached = await userCache.get<T[]>(this.cacheKey);
      if (cached) return cached;
    }

    const { data, error } = await this.query;
    
    if (error) {
      throw error;
    }

    if (this.shouldCache && this.cacheKey) {
      await userCache.set(this.cacheKey, data, this.cacheTTL);
    }

    return data;
  }
}
