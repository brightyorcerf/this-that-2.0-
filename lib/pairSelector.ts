import { Image } from "@/types/image";

/**
 * Logic: Pick a random image A, then try to find image B with a similar rating.
 * Fallback to a random image if no similar candidates exist.
 */
export function selectPair(images: Image[]): [Image, Image] {
  if (images.length < 2) {
    throw new Error("At least 2 images are required to select a pair.");
  }

  // 1. Pick a random Image A
  const indexA = Math.floor(Math.random() * images.length);
  const imageA = images[indexA];

  // 2. Filter for candidates that aren't Image A and are within 200 Elo points
  const candidates = images.filter(
    (img) => img.id !== imageA.id && Math.abs(img.rating - imageA.rating) < 200
  );

  // 3. Pick Image B from candidates, or fallback to any other image
  let imageB: Image;
  if (candidates.length > 0) {
    imageB = candidates[Math.floor(Math.random() * candidates.length)];
  } else {
    const remainingImages = images.filter((img) => img.id !== imageA.id);
    imageB = remainingImages[Math.floor(Math.random() * remainingImages.length)];
  }

  return [imageA, imageB];
}