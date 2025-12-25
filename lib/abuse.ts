import crypto from 'crypto';

/**
 * Generates a unique hash for a voter based on IP, Browser, and the specific Poll.
 */
export function generateVoterHash(ip: string, userAgent: string, pollId: string): string {
  return crypto
    .createHash('sha256')
    .update(`${ip}-${userAgent}-${pollId}`)
    .digest('hex');
}

/**
 * Note: Rate limiting logic (10 votes per hour) should be checked 
 * in the /api/vote/submit route using this hash against the Postgres 'votes' table.
 */