'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BattleCard from '@/components/BattleCard';

interface ImagePair {
  imageA: {
    id: string;
    image_url: string;
    rating: number;
  };
  imageB: {
    id: string;
    image_url: string;
    rating: number;
  };
}

export default function VotePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [pair, setPair] = useState<ImagePair | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPair = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pair/get?pollSlug=${slug}`);
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch pair');
      }
      
      const data = await res.json();
      setPair(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPair();
  }, [slug]);

  const handleVote = async (winnerId: string) => {
    if (!pair || voting) return;

    setVoting(true);
    
    const loserId = winnerId === pair.imageA.id ? pair.imageB.id : pair.imageA.id;
    
    // Get the poll_id from one of the images
    const pollId = pair.imageA.poll_id;

    try {
      const res = await fetch('/api/vote/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pollId,
          winnerId,
          loserId
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to submit vote');
      }

      // Immediately fetch next pair
      await fetchPair();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote');
    } finally {
      setVoting(false);
    }
  };

  if (loading && !pair) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error && !pair) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-red-500 text-xl text-center px-4">
          {error}
        </div>
      </div>
    );
  }

  if (!pair) return null;

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      {/* Desktop: Side by side */}
      <div className="hidden md:flex h-full w-full">
        <div className="flex-1 p-4">
          <BattleCard
            imageUrl={pair.imageA.image_url}
            imageId={pair.imageA.id}
            onVote={handleVote}
            disabled={voting}
          />
        </div>
        <div className="flex-1 p-4">
          <BattleCard
            imageUrl={pair.imageB.image_url}
            imageId={pair.imageB.id}
            onVote={handleVote}
            disabled={voting}
          />
        </div>
      </div>

      {/* Mobile: Stacked */}
      <div className="flex md:hidden flex-col h-full w-full">
        <div className="flex-1 p-4">
          <BattleCard
            imageUrl={pair.imageA.image_url}
            imageId={pair.imageA.id}
            onVote={handleVote}
            disabled={voting}
          />
        </div>
        <div className="flex-1 p-4">
          <BattleCard
            imageUrl={pair.imageB.image_url}
            imageId={pair.imageB.id}
            onVote={handleVote}
            disabled={voting}
          />
        </div>
      </div>

      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}