# GitHub Integration Documentation

## 🚀 Overview

This document provides comprehensive information about the GitHub integration system implemented in SyntaxLab. The integration allows users to:

- **Import** any public GitHub repository into the playground
- **Export** playground code to GitHub repositories
- **Sync** changes bidirectionally between playground and GitHub
- **Create** new repositories from playground templates

## 🏗️ Architecture

### System Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend UI   │◄──►│   API Routes    │◄──►│  GitHub API     │
│                 │    │                  │    │                 │
│ • Repo Browser  │    │ • /api/github/   │    │ • Repositories  │
│ • Export Modal  │    │ • /api/import/   │    │ • Contents      │
│ • Sync Status   │    │ • /api/export/   │    │ • Commits       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Database      │    │  File System    │    │  Git Operations │
│                 │    │                  │    │                 │
│ • Playground    │    │ • Temp Storage   │    │ • Clone/Push    │
│ • TemplateFiles│    │ • File Cache     │    │ • Branch Mgmt   │
│ • GitHub Sync   │    │ • Export Files   │    │ • Commits       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Core Libraries

#### 1. GitHub API Client (`features/github/libs/github-api.ts`)
- **Purpose**: Direct communication with GitHub REST API
- **Features**:
  - Repository management (list, get, create)
  - File operations (read, create, update)
  - Branch management
  - Pull request creation
  - Search functionality

#### 2. Git Operations (`features/github/libs/git-operations.ts`)
- **Purpose**: High-level Git operations using GitHub API
- **Features**:
  - Template to GitHub file conversion
  - Repository import/export
  - Commit and push operations
  - Branch creation and PR management

#### 3. UI Components
- **RepoSelectorModal**: Browse and select GitHub repositories
- **GitHubExportModal**: Export playground to GitHub
- **GitHubSyncStatus**: Display sync status and actions

## 🔧 Setup & Configuration

### 1. Environment Variables

Add these to your `.env` file:

```env
# GitHub OAuth (already exists, update scope)
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret

# Next.js URL for API callbacks
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=your_auth_secret
```

### 2. GitHub OAuth App Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App with:
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:3000`

3. Note the Client ID and generate Client Secret

### 3. Database Schema Updates

The system adds a `CUSTOM` template type for imported repositories:

```prisma
enum Templates {
  REACT
  NEXTJS
  EXPRESS
  VUE
  HONO
  ANGULAR
  CUSTOM  // Added for GitHub imports
}
```

Run `npx prisma generate && npx prisma db push` to apply changes.

## 📚 API Endpoints

### Authentication
- **Scope**: Updated to include `repo user:email` permissions
- **Provider**: GitHub OAuth with repository access

### Repository Management

#### GET `/api/github/repositories`
Fetch user's repositories

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123456,
      "name": "my-repo",
      "full_name": "username/my-repo",
      "description": "Repository description",
      "private": false,
      "html_url": "https://github.com/username/my-repo",
      "default_branch": "main",
      "language": "TypeScript",
      "stargazers_count": 42,
      "owner": {
        "login": "username",
        "id": 789012
      }
    }
  ]
}
```

#### POST `/api/github/repositories`
Search GitHub repositories

**Request:**
```json
{
  "query": "react typescript",
  "perPage": 20
}
```

### Import Operations

#### POST `/api/github/import`
Import a GitHub repository into playground

**Request:**
```json
{
  "owner": "username",
  "repo": "repository-name",
  "branch": "main"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully imported username/repository-name",
  "data": {
    "folderName": "repository-name",
    "items": [
      {
        "filename": "index",
        "fileExtension": "js",
        "content": "console.log('Hello World');"
      }
    ]
  }
}
```

#### POST `/api/playground/create-from-github`
Create playground from imported repository

**Request:**
```json
{
  "title": "My Imported Project",
  "description": "Imported from GitHub",
  "templateData": { /* TemplateFolder structure */ },
  "githubRepo": {
    "owner": "username",
    "repo": "repository-name",
    "branch": "main",
    "url": "https://github.com/username/repository-name"
  }
}
```

### Export Operations

#### POST `/api/github/export`
Export playground to existing repository

**Request:**
```json
{
  "playgroundId": "playground_123",
  "owner": "username",
  "repo": "target-repo",
  "branch": "main",
  "commitMessage": "Update from playground"
}
```

#### POST `/api/github/create-repo`
Create new repository from playground

**Request:**
```json
{
  "playgroundId": "playground_123",
  "repoName": "my-new-repo",
  "description": "Created from playground",
  "isPrivate": false
}
```

## 🎯 User Interface Components

### 1. Repository Selector Modal

**Location**: `features/github/components/repo-selector-modal.tsx`

**Features**:
- Browse user's repositories
- Search GitHub repositories
- Filter by language, stars, etc.
- Repository cards with metadata

**Usage**:
```tsx
<RepoSelectorModal 
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSelectRepository={handleRepoSelect}
  title="Select Repository"
/>
```

### 2. GitHub Export Modal

**Location**: `features/github/components/github-export-modal.tsx`

**Features**:
- Export to existing repository
- Create new repository
- Branch selection
- Commit message customization
- Private/public repository options

**Usage**:
```tsx
<GitHubExportModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  playgroundId="playground_123"
  playgroundTitle="My Project"
/>
```

### 3. GitHub Sync Status

**Location**: `features/github/components/github-sync-status.tsx`

**Features**:
- Display sync status
- Show repository information
- Sync/Export actions
- Last sync timestamp

**Usage**:
```tsx
<GitHubSyncStatus
  playgroundId="playground_123"
  className="w-full"
/>
```

### 4. GitHub Export Button

**Location**: `features/playground/components/github-export-button.tsx`

**Features**:
- Quick export button
- Opens export modal
- Can be placed in any playground

## 🔄 Workflow Examples

### Importing a Repository

1. User clicks "Open GitHub Repository" on dashboard
2. Repository selector modal opens
3. User searches/selects a repository
4. System imports repository structure
5. New playground created with imported code
6. User redirected to playground editor

### Exporting to GitHub

1. User opens playground
2. Clicks "Export to GitHub" button
3. Export modal opens with two options:
   - **Existing Repo**: Select target repository
   - **New Repo**: Create new repository
4. User configures export options
5. System pushes files to GitHub
6. Success confirmation displayed

### Syncing Changes

1. User makes changes in playground
2. Auto-save updates local template
3. User clicks "Sync" in GitHub status component
4. System commits and pushes changes to GitHub
5. Sync status updated

## 🛠️ Development Guide

### Adding New GitHub Features

1. **API Client**: Add methods to `GitHubAPIClient` class
2. **Git Operations**: Add high-level operations to `GitOperations` class
3. **API Routes**: Create new endpoints in `app/api/github/`
4. **UI Components**: Create new components in `features/github/components/`

### Error Handling

All API endpoints follow consistent error handling:

```typescript
// Success response
{
  "success": true,
  "message": "Operation completed",
  "data": { /* result data */ }
}

// Error response
{
  "success": false,
  "error": "Error message",
  "details": { /* optional error details */ }
}
```

### Rate Limiting

GitHub API has rate limits:
- **Authenticated requests**: 5,000 requests/hour
- **Search requests**: 30 requests/minute

The system includes basic rate limiting awareness and retries.

### File Size Limits

- **Maximum file size**: 1MB for text files
- **Binary files**: Skipped with placeholder message
- **Ignored files**: node_modules, .git, dist, build, etc.

## 🔒 Security Considerations

### OAuth Scopes
- **Required**: `repo user:email`
- **Purpose**: Repository access and user identification

### Token Management
- GitHub access tokens stored securely in session
- Tokens never exposed to client-side
- Automatic token refresh handled by Auth.js

### Repository Permissions
- Users can only access their own repositories
- Public repositories can be imported by anyone
- Private repositories require explicit access

## 🚨 Troubleshooting

### Common Issues

#### 1. "GitHub access token not found"
**Cause**: User not authenticated with proper GitHub scope
**Solution**: Re-authenticate with GitHub after OAuth scope update

#### 2. "Failed to import repository"
**Causes**:
- Repository doesn't exist
- No access to private repository
- Network issues
**Solutions**:
- Check repository URL
- Verify repository is public or user has access
- Check network connectivity

#### 3. "Export failed - permission denied"
**Causes**:
- No write access to target repository
- OAuth token expired
**Solutions**:
- Verify repository permissions
- Re-authenticate with GitHub

#### 4. Large file import issues
**Cause**: File size exceeds 1MB limit
**Solution**: 
- Increase limit in `git-operations.ts`
- Add file filtering for large binaries

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=github:*
```

### Testing

Run the test suite:
```bash
npm run test:github
```

## 📈 Performance Considerations

### Caching
- Repository list cached for 5 minutes
- File content cached during import process
- GitHub API responses cached where appropriate

### Optimization
- Lazy loading of repository contents
- Parallel file operations where possible
- Efficient template structure conversion

## 🔄 Future Enhancements

### Planned Features
- [ ] Real-time collaboration with GitHub
- [ ] Pull request management
- [ ] GitHub Actions integration
- [ ] Repository analytics
- [ ] Branch comparison tool
- [ ] Conflict resolution UI

### API Extensions
- [ ] GitHub GraphQL API integration
- [ ] Webhook support for real-time sync
- [ ] GitHub Projects integration

## 📞 Support

For issues with GitHub integration:

1. Check this documentation first
2. Review browser console for errors
3. Verify environment variables
4. Check GitHub OAuth app settings
5. Review GitHub API rate limits

## 📄 License

This GitHub integration system is part of SyntaxLab and follows the same license terms.

---

**Last Updated**: February 2026
**Version**: 1.0.0
