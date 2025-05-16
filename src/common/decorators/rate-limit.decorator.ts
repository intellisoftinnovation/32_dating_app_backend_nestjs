import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_METADATA_KEY = 'rateLimit';

export const RateLimit = (limit: number, timeWindow: number) => 
  SetMetadata(RATE_LIMIT_METADATA_KEY, { limit, timeWindow });
