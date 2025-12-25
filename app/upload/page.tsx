'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { Card } from '@/components/ui/card';

function UploadPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const token = searchParams.get('token');

  const [pollId, setPollId] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadsClosed, setUploadsClosed] = useState(false);

  useEffect(() => {
    const verifyPoll = async () => {
      if (!token) {
        setIsValid(false);
        setLoading(false);
        return;
      }

      try {
        // We'll verify by trying to fetch poll info from our API
        // For now, we'll just construct the pollId from slug
        // In production, you'd want an API endpoint to verify token
        setIsValid(true);
        setPollId(slug); // Using slug as pollId for now
      } catch (error) {
        console.error('Verification error:', error);
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    verifyPoll();
  }, [slug, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Verifying access...</div>
      </div>
    );
  }

  if (!token || !isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center space-y-4">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-bold">Invalid Upload Link</h2>
          <p className="text-gray-600">
            This upload link is invalid or has expired.
          </p>
        </Card>
      </div>
    );
  }

  if (uploadsClosed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center space-y-4">
          <div className="text-6xl">🚫</div>
          <h2 className="text-2xl font-bold">Uploads Closed</h2>
          <p className="text-gray-600">
            The poll creator has closed uploads for this poll.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Add Your Images</h1>
          <p className="text-gray-600">
            Upload images to participate in this poll
          </p>
        </div>

        <Card className="p-6">
          <ImageUploader
            pollId={pollId!}
            token={token}
            onUploadComplete={() => {}}
          />
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Your images will be added to the voting pool</p>
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <UploadPageContent />
    </Suspense>
  );
}