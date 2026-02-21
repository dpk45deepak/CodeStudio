export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  clone_url: string;
  default_branch: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
}

export interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
  content?: string;
  encoding?: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  tree: {
    sha: string;
  };
}

export interface GitHubCreateFileParams {
  owner: string;
  repo: string;
  path: string;
  content: string;
  message: string;
  branch?: string;
  sha?: string;
}

export interface GitHubCreateRepoParams {
  name: string;
  description?: string;
  private?: boolean;
  auto_init?: boolean;
}

export class GitHubAPIClient {
  private accessToken: string;
  private baseUrl = 'https://api.github.com';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `token ${this.accessToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `GitHub API Error: ${response.status} ${response.statusText} - ${
          errorData.message || 'Unknown error'
        }`
      );
    }

    return response.json();
  }

  async getUserRepositories(): Promise<GitHubRepository[]> {
    return this.request<GitHubRepository[]>('/user/repos?per_page=100&sort=updated');
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.request<GitHubRepository>(`/repos/${owner}/${repo}`);
  }

  async getRepositoryContents(
    owner: string,
    repo: string,
    path: string = '',
    branch?: string
  ): Promise<GitHubFileContent[]> {
    const branchParam = branch ? `?ref=${branch}` : '';
    const contents = await this.request<any[]>(
      `/repos/${owner}/${repo}/contents/${path}${branchParam}`
    );
    
    // Handle single file response
    if (!Array.isArray(contents)) {
      return [contents];
    }
    
    return contents;
  }

  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    branch?: string
  ): Promise<string> {
    const file = await this.request<any>(
      `/repos/${owner}/${repo}/contents/${path}${branch ? `?ref=${branch}` : ''}`
    );
    
    if (file.encoding === 'base64') {
      return atob(file.content);
    }
    
    return file.content;
  }

  async createOrUpdateFile(params: GitHubCreateFileParams): Promise<any> {
    const { owner, repo, path, content, message, branch, sha } = params;
    
    const body = {
      message,
      content: btoa(content),
      branch: branch || 'main',
      ...(sha && { sha }),
    };

    const endpoint = sha
      ? `/repos/${owner}/${repo}/contents/${path}`
      : `/repos/${owner}/${repo}/contents/${path}`;

    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async createRepository(params: GitHubCreateRepoParams): Promise<GitHubRepository> {
    return this.request<GitHubRepository>('/user/repos', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getBranches(owner: string, repo: string): Promise<any[]> {
    return this.request<any[]>(`/repos/${owner}/${repo}/branches`);
  }

  async createBranch(
    owner: string,
    repo: string,
    branchName: string,
    fromBranch: string = 'main'
  ): Promise<any> {
    // Get the SHA of the source branch
    const sourceBranch = await this.request<any>(
      `/repos/${owner}/${repo}/git/ref/heads/${fromBranch}`
    );
    
    return this.request(`/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: sourceBranch.object.sha,
      }),
    });
  }

  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    head: string,
    base: string = 'main',
    body?: string
  ): Promise<any> {
    return this.request(`/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        head,
        base,
        body,
      }),
    });
  }

  async getCommits(owner: string, repo: string, branch?: string): Promise<GitHubCommit[]> {
    const branchParam = branch ? `?sha=${branch}` : '';
    return this.request<GitHubCommit[]>(
      `/repos/${owner}/${repo}/commits${branchParam}`
    );
  }

  async searchRepositories(query: string, perPage: number = 20): Promise<{
    items: GitHubRepository[];
    total_count: number;
  }> {
    return this.request(`/search/repositories?q=${encodeURIComponent(query)}&per_page=${perPage}`);
  }
}
