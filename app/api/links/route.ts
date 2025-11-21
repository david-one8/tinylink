import { NextRequest, NextResponse } from 'next/server';
import { createLinkSchema } from '@/app/_lib/validations';
import { getAllLinks, createLink, checkCodeExists } from '@/app/_lib/server/queries';
import { generateShortCode } from '@/app/_lib/utils';

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export async function GET() {
  try {
    const links = await getAllLinks();
    return NextResponse.json({ ok: true, data: links });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with schema first
    const validation = createLinkSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          ok: false,
          error: validation.error.errors[0]?.message || 'Invalid input'
        },
        { status: 400 }
      );
    }

    const targetUrl = (validation.data.targetUrl || '').trim();
    let code = (validation.data.customCode || '').trim();

    // Validate custom code format if provided
    if (code) {
      if (!CODE_REGEX.test(code)) {
        return NextResponse.json(
          { ok: false, error: 'Custom code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }

      // Check for duplicate code
      if (await checkCodeExists(code)) {
        return NextResponse.json(
          { ok: false, error: 'Code already exists' },
          { status: 409 }
        );
      }
    } else {
      // Generate a unique random code if none provided
      let attempts = 0;
      const maxAttempts = 10;
      do {
        code = generateShortCode(6);
        if (!(await checkCodeExists(code))) break;
        attempts++;
      } while (attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        return NextResponse.json(
          { ok: false, error: 'Failed to generate unique code' },
          { status: 500 }
        );
      }
    }

    // Create and return the new link entry
    const link = await createLink(code, targetUrl);
    return NextResponse.json({ ok: true, data: link }, { status: 201 });

  } catch (error: any) {
    if (error.message === 'Code already exists') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to create link' },
      { status: 500 }
    );
  }
}
