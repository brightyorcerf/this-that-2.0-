import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

function generateSlug(): string {
  return crypto.randomBytes(4).toString('hex');
}

function generateToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

export async function POST() {
  try {
    const slug = generateSlug();
    const uploadToken = generateToken();

    const { data, error } = await supabaseAdmin
      .from('polls')
      .insert({
        slug,
        upload_token: uploadToken,
        is_upload_open: true
      })
      .select()
      .single();

    if (error) {
      console.error('Poll creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create poll' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      pollId: data.id,
      slug: data.slug,
      uploadToken: data.upload_token
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}