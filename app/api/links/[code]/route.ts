import { NextRequest, NextResponse } from 'next/server';
import { getLinkByCode, deleteLink } from '@/app/_lib/server/queries';

// Defines allowed short code format
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  // Defensive: trim and validate code param
  const code = (params.code || '').trim();
  if (!CODE_REGEX.test(code)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid code format' },
      { status: 400 }
    );
  }

  try {
    const link = await getLinkByCode(code);

    if (!link) {
      return NextResponse.json(
        { ok: false, error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: link });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to fetch link' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  // Defensive: trim and validate code param
  const code = (params.code || '').trim();
  if (!CODE_REGEX.test(code)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid code format' },
      { status: 400 }
    );
  }

  try {
    const deleted = await deleteLink(code);

    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, message: 'Link deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to delete link' },
      { status: 500 }
    );
  }
}
