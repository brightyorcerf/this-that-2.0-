export const INITIAL_RATING = 1200;
export const K_FACTOR = 24;

export function calculateElo(
  ratingA: number,
  ratingB: number,
  didAWin: boolean
) {
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 - expectedA;

  const scoreA = didAWin ? 1 : 0;
  const scoreB = didAWin ? 0 : 1;

  const newRatingA = Math.round(ratingA + K_FACTOR * (scoreA - expectedA));
  const newRatingB = Math.round(ratingB + K_FACTOR * (scoreB - expectedB));

  return {
    newRatingA,
    newRatingB
  };
}