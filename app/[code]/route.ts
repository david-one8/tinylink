import { NextRequest, NextResponse } from 'next/server';
import { getLinkByCode, incrementClick } from '@/app/_lib/server/queries';
import { codeParamSchema } from '@/app/_lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const validation = codeParamSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid code format' },
        { status: 404 }
      );
    }

    const link = await getLinkByCode(params.code);
    
    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Increment click count asynchronously
    incrementClick(params.code).catch(console.error);

    // Perform 302 redirect
    return NextResponse.redirect(link.target_url, { status: 302 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
