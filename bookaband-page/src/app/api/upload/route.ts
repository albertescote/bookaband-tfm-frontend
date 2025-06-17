import { NextRequest, NextResponse } from 'next/server';
import { getAccessTokenCookie } from '@/service/utils';
import { BACKEND_URL } from '@/publicConfig';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 25MB limit' },
        { status: 400 },
      );
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',

      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

      'audio/mpeg',
      'audio/wav',
      'audio/ogg',

      'video/mp4',
      'video/webm',
      'video/quicktime',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 },
      );
    }

    const accessToken = await getAccessTokenCookie();
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const response = await fetch(`${BACKEND_URL}/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to upload file' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
