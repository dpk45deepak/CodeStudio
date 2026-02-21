import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { GitOperations } from '@/features/github/libs/git-operations';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { owner, repo, branch = 'main' } = body;

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Owner and repository name are required' },
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

    const gitOps = new GitOperations(accessToken);
    const result = await gitOps.importGitHubRepository(owner, repo, branch);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error('GitHub import error:', error);
    return NextResponse.json(
      { error: 'Failed to import repository' },
      { status: 500 }
    );
  }
}
