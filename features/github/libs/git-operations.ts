import { GitHubAPIClient, GitHubCreateFileParams } from './github-api';
import { TemplateFolder, TemplateFile, TemplateItem } from '../../playground/libs/path-to-json';

export interface GitOperationResult {
  success: boolean;
  message: string;
  data?: any;
}

export class GitOperations {
  private githubClient: GitHubAPIClient;

  constructor(accessToken: string) {
    this.githubClient = new GitHubAPIClient(accessToken);
  }

  /**
   * Convert TemplateFolder structure to GitHub file operations
   */
  private templateFolderToFiles(
    folder: TemplateFolder,
    basePath: string = ''
  ): Array<{ path: string; content: string }> {
    const files: Array<{ path: string; content: string }> = [];

    const processItem = (item: TemplateItem, currentPath: string) => {
      if ('filename' in item) {
        // It's a file
        const filePath = currentPath ? `${currentPath}/${item.filename}` : item.filename;
        files.push({
          path: filePath,
          content: item.content,
        });
      } else {
        // It's a folder
        const folderPath = currentPath ? `${currentPath}/${item.folderName}` : item.folderName;
        item.items.forEach(subItem => processItem(subItem, folderPath));
      }
    };

    folder.items.forEach(item => processItem(item, basePath));
    return files;
  }

  /**
   * Push playground template to GitHub repository
   */
  async pushPlaygroundToGitHub(
    owner: string,
    repo: string,
    template: TemplateFolder,
    commitMessage: string = 'Update playground files',
    branch: string = 'main'
  ): Promise<GitOperationResult> {
    try {
      const files = this.templateFolderToFiles(template);
      const results = [];

      for (const file of files) {
        try {
          // Try to get existing file to get its SHA
          let sha: string | undefined;
          try {
            const existingFile = await this.githubClient.getRepositoryContents(
              owner,
              repo,
              file.path,
              branch
            );
            if (Array.isArray(existingFile)) {
              const fileItem = existingFile.find((f: any) => f.path === file.path);
              sha = fileItem?.sha;
            } else if ((existingFile as any).path === file.path) {
              sha = (existingFile as any).sha;
            }
          } catch (error) {
            // File doesn't exist, we'll create it
            sha = undefined;
          }

          const result = await this.githubClient.createOrUpdateFile({
            owner,
            repo,
            path: file.path,
            content: file.content,
            message: `${commitMessage} - ${file.path}`,
            branch,
            sha,
          });

          results.push({ path: file.path, success: true, data: result });
        } catch (error) {
          results.push({ 
            path: file.path, 
            success: false, 
            error: (error as Error).message 
          });
        }
      }

      const failedFiles = results.filter(r => !r.success);
      if (failedFiles.length > 0) {
        return {
          success: false,
          message: `Failed to push ${failedFiles.length} files. Success: ${results.length - failedFiles.length}`,
          data: results,
        };
      }

      return {
        success: true,
        message: `Successfully pushed ${results.length} files to ${owner}/${repo}`,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to push to GitHub: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Import GitHub repository to TemplateFolder format
   */
  async importGitHubRepository(
    owner: string,
    repo: string,
    branch: string = 'main'
  ): Promise<GitOperationResult> {
    try {
      const template = await this.convertRepoToTemplateFolder(owner, repo, branch);
      
      return {
        success: true,
        message: `Successfully imported ${owner}/${repo}`,
        data: template,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to import repository: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Convert GitHub repository to TemplateFolder structure
   */
  private async convertRepoToTemplateFolder(
    owner: string,
    repo: string,
    branch: string,
    path: string = ''
  ): Promise<TemplateFolder> {
    const contents = await this.githubClient.getRepositoryContents(
      owner,
      repo,
      path,
      branch
    );

    const items: TemplateItem[] = [];

    for (const item of contents) {
      if (item.type === 'dir') {
        // Skip common ignored directories
        if (['node_modules', '.git', '.next', 'dist', 'build'].includes(item.name)) {
          continue;
        }

        const subFolder = await this.convertRepoToTemplateFolder(
          owner,
          repo,
          branch,
          item.path
        );
        items.push(subFolder);
      } else if (item.type === 'file') {
        // Skip common ignored files
        if ([
          'package-lock.json',
          'yarn.lock',
          '.gitignore',
          '.DS_Store',
          'thumbs.db'
        ].includes(item.name)) {
          continue;
        }

        let content = '';
        try {
          // Only fetch content for text files (skip binaries)
          const textExtensions = [
            '.js', '.ts', '.jsx', '.tsx', '.vue', '.html', '.css', '.scss',
            '.json', '.md', '.txt', '.yml', '.yaml', '.xml', '.svg',
            '.py', '.java', '.cpp', '.c', '.h', '.go', '.rs', '.php'
          ];
          
          const hasTextExtension = textExtensions.some(ext => 
            item.name.toLowerCase().endsWith(ext)
          );

          if (hasTextExtension && item.size < 1024 * 1024) { // 1MB limit
            content = await this.githubClient.getFileContent(
              owner,
              repo,
              item.path,
              branch
            );
          } else {
            content = `[Binary file or too large: ${item.name} (${item.size} bytes)]`;
          }
        } catch (error) {
          content = `Error reading file: ${(error as Error).message}`;
        }

        const fileName = item.name.includes('.') 
          ? item.name.substring(0, item.name.lastIndexOf('.'))
          : item.name;
        const extension = item.name.includes('.') 
          ? item.name.substring(item.name.lastIndexOf('.') + 1)
          : '';

        items.push({
          filename: fileName,
          fileExtension: extension,
          content,
        });
      }
    }

    const folderName = path ? path.split('/').pop() || repo : repo;

    return {
      folderName,
      items,
    };
  }

  /**
   * Create a new repository from playground template
   */
  async createRepositoryFromPlayground(
    repoName: string,
    template: TemplateFolder,
    description?: string,
    isPrivate: boolean = false
  ): Promise<GitOperationResult> {
    try {
      // Create the repository
      const repo = await this.githubClient.createRepository({
        name: repoName,
        description,
        private: isPrivate,
        auto_init: true,
      });

      // Push the template files
      const pushResult = await this.pushPlaygroundToGitHub(
        repo.owner.login,
        repo.name,
        template,
        'Initial commit from playground',
        'main'
      );

      return {
        success: pushResult.success,
        message: `Repository ${repoName} created and files pushed`,
        data: { repository: repo, pushResult: pushResult.data },
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create repository: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Create a pull request for playground changes
   */
  async createPullRequestFromPlayground(
    owner: string,
    repo: string,
    template: TemplateFolder,
    branchName: string,
    prTitle: string,
    prDescription?: string
  ): Promise<GitOperationResult> {
    try {
      // Create a new branch
      await this.githubClient.createBranch(owner, repo, branchName);

      // Push changes to the new branch
      const pushResult = await this.pushPlaygroundToGitHub(
        owner,
        repo,
        template,
        `Update playground files for PR: ${prTitle}`,
        branchName
      );

      if (!pushResult.success) {
        return pushResult;
      }

      // Create pull request
      const pr = await this.githubClient.createPullRequest(
        owner,
        repo,
        prTitle,
        branchName,
        'main',
        prDescription
      );

      return {
        success: true,
        message: `Pull request created: ${pr.html_url}`,
        data: { pullRequest: pr, pushResult: pushResult.data },
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create pull request: ${(error as Error).message}`,
      };
    }
  }
}
