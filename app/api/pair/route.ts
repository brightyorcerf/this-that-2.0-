import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { selectPair } from '@/lib/pairSelector';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pollSlug = searchParams.get('pollSlug');

    if (!pollSlug) {
      return NextResponse.json(
        { error: 'Missing pollSlug parameter' },
        { status: 400 }
      );
    }

    // Get poll by slug
    const { data: poll, error: pollError } = await supabaseAdmin
      .from('polls')
      .select('id')
      .eq('slug', pollSlug)
      .single();

    if (pollError || !poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    // Get all images for this poll
    const { data: images, error: imagesError } = await supabaseAdmin
      .from('images')
      .select('id, image_url, rating, poll_id')
      .eq('poll_id', poll.id);

    if (imagesError) {
      console.error('Error fetching images:', imagesError);
      return NextResponse.json(
        { error: 'Failed to fetch images' },
        { status: 500 }
      );
    }

    if (!images || images.length < 2) {
      return NextResponse.json(
        { error: 'Not enough images to create a pair' },
        { status: 400 }
      );
    }

    // Select a pair
    const pair = selectPair(images);

    if (!pair) {
      return NextResponse.json(
        { error: 'Could not generate pair' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageA: pair[0],
      imageB: pair[1]
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}