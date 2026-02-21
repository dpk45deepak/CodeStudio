import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { GitOperations } from '@/features/github/libs/git-operations';
import { db } from '@/lib/db';
import { readTemplateStructureFromJson } from '@/features/playground/libs/path-to-json';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      playgroundId, 
      owner, 
      repo, 
      branch = 'main', 
      commitMessage = 'Export from playground' 
    } = body;

    if (!playgroundId || !owner || !repo) {
      return NextResponse.json(
        { error: 'Playground ID, owner, and repository are required' },
        { status: 400 }
      );
    }

    // Get GitHub access token from session
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'GitHub access token not found' },
        { status: 401 }
      );
    }

    // Get playground data from database
    const playground = await db.playground.findUnique({
      where: { id: playgroundId },
      include: {
        templateFiles: true,
      },
    });

    if (!playground) {
      return NextResponse.json(
        { error: 'Playground not found' },
        { status: 404 }
      );
    }

    // Check if user owns this playground
    if (playground.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to export this playground' },
        { status: 403 }
      );
    }

    // Get template structure
    let templateStructure;
    if (playground.templateFiles && playground.templateFiles.length > 0) {
      templateStructure = JSON.parse(playground.templateFiles[0].content as string);
    } else {
      // If no saved files, get the original template
      const templateResponse = await fetch(
        `${process.env.NEXTAUTH_URL}/api/template/${playgroundId}`
      );
      const templateData = await templateResponse.json();
      templateStructure = templateData.templateJson;
    }

    const gitOps = new GitOperations(accessToken);
    const result = await gitOps.pushPlaygroundToGitHub(
      owner,
      repo,
      templateStructure,
      commitMessage,
      branch
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.message, details: result.data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error('GitHub export error:', error);
    return NextResponse.json(
      { error: 'Failed to export to GitHub' },
      { status: 500 }
    );
  }
}
