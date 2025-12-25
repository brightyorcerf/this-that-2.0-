import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { INITIAL_RATING } from '@/lib/elo';
import { generateVoterHash, getClientIP, getUserAgent } from '@/lib/abuse';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pollId = formData.get('pollId') as string;
    const token = formData.get('token') as string;

    if (!file || !pollId || !token) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify poll exists and token is valid
    const { data: poll, error: pollError } = await supabaseAdmin
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .eq('upload_token', token)
      .single();

    if (pollError || !poll) {
      return NextResponse.json(
        { error: 'Invalid poll or token' },
        { status: 403 }
      );
    }

    if (!poll.is_upload_open) {
      return NextResponse.json(
        { error: 'Uploads are closed for this poll' },
        { status: 403 }
      );
    }

    // Generate uploader hash for tracking
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);
    const uploaderHash = generateVoterHash(ip, userAgent, pollId);

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${pollId}/${crypto.randomUUID()}.${fileExt}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const { error: uploadError } = await supabaseAdmin.storage
      .from('poll-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('poll-images')
      .getPublicUrl(fileName);

    // Insert image record
    const { data: image, error: dbError } = await supabaseAdmin
      .from('images')
      .insert({
        poll_id: pollId,
        image_url: publicUrl,
        rating: INITIAL_RATING,
        uploader_hash: uploaderHash
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save image record' },
        { status: 500 }
      );
    }

    return NextResponse.json({ image });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}