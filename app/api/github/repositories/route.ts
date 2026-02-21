import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { GitHubAPIClient } from '@/features/github/libs/github-api';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get GitHub access token from session
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'GitHub access token not found' },
        { status: 401 }
      );
    }

    const githubClient = new GitHubAPIClient(accessToken);
    const repositories = await githubClient.getUserRepositories();

    return NextResponse.json({
      success: true,
      data: repositories,
    });
  } catch (error) {
    console.error('GitHub repositories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { query, perPage = 20 } = body;

    // Get GitHub access token from session
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'GitHub access token not found' },
        { status: 401 }
      );
    }

    const githubClient = new GitHubAPIClient(accessToken);
    const searchResult = await githubClient.searchRepositories(query, perPage);

    return NextResponse.json({
      success: true,
      data: searchResult.items,
      totalCount: searchResult.total_count,
    });
  } catch (error) {
    console.error('GitHub search error:', error);
    return NextResponse.json(
      { error: 'Failed to search repositories' },
      { status: 500 }
    );
  }
}
