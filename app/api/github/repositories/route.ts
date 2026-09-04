import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { GitHubAPIClient } from '@/features/github/libs/github-api';
import { getGithubAccessToken } from '@/lib/github-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    // Get GitHub access token from session
    const accessToken = await getGithubAccessToken(session.user.id);
    if (!accessToken) {
      return NextResponse.json(
        { error: 'GitHub access token not found - Please authenticate with GitHub first' },
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
    
    // Handle specific GitHub API errors
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'GitHub token expired or invalid - Please re-authenticate with GitHub' },
          { status: 401 }
        );
      }
      if (error.message.includes('403') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded - Please try again later' },
          { status: 429 }
        );
      }
    }
    
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
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    const body = await request.json();
    const { query, perPage = 20 } = body;

    // Get GitHub access token from session
    const accessToken = await getGithubAccessToken(session.user.id);
    if (!accessToken) {
      return NextResponse.json(
        { error: 'GitHub access token not found - Please authenticate with GitHub first' },
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
    
    // Handle specific GitHub API errors
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'GitHub token expired or invalid - Please re-authenticate with GitHub' },
          { status: 401 }
        );
      }
      if (error.message.includes('403') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded - Please try again later' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to search repositories' },
      { status: 500 }
    );
  }
}
