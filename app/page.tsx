'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const handleCreatePoll = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/poll/create', {
        method: 'POST'
      });

      if (!res.ok) {
        throw new Error('Failed to create poll');
      }

      const data = await res.json();
      router.push(`/create?pollId=${data.pollId}&slug=${data.slug}&token=${data.uploadToken}`);
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Failed to create poll. Please try again.');
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-white">
            🔥
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            This or That
          </h2>
          <p className="text-xl md:text-2xl text-gray-400">
            Upload images. Share the link. Let others vote.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleCreatePoll}
            disabled={creating}
            size="lg"
            className="text-xl px-8 py-6 bg-white text-black hover:bg-gray-200"
          >
            {creating ? 'Creating...' : 'Create Poll'}
          </Button>

          <p className="text-sm text-gray-500">
            No signup. No ads. Just voting.
          </p>
        </div>
      </div>
    </div>
  );
}