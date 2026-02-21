import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { TemplateFolder } from '@/features/playground/libs/path-to-json';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      description, 
      templateData, 
      githubRepo 
    } = body;

    if (!title || !templateData) {
      return NextResponse.json(
        { error: 'Title and template data are required' },
        { status: 400 }
      );
    }

    // Create playground record
    const playground = await db.playground.create({
      data: {
        title,
        description: description || '',
        template: 'CUSTOM' as any, // Custom template for imported repos
        userId: session.user.id!,
      },
    });

    // Save template files
    await db.templateFile.create({
      data: {
        playgroundId: playground.id,
        content: JSON.stringify(templateData),
      },
    });

    // Save GitHub repository info (you might want to add this to the schema)
    // For now, we'll store it in the template content or create a separate table

    return NextResponse.json({
      success: true,
      playgroundId: playground.id,
      message: 'Playground created from GitHub repository',
    });
  } catch (error) {
    console.error('Create playground from GitHub error:', error);
    return NextResponse.json(
      { error: 'Failed to create playground' },
      { status: 500 }
    );
  }
}
