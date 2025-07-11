# ERPNext App Builder - Remote MCP Server

This is a remote MCP server implementation for the ERPNext App Builder project, enabling secure remote access to Frappe/ERPNext functionality through the Model Context Protocol.

## Features

- **🔐 GitHub OAuth Authentication**: Secure authentication using GitHub accounts
- **📊 Frappe Integration**: Direct integration with your Frappe/ERPNext instance
- **🛠️ Document Management**: Create, read, update, and list Frappe documents
- **🏗️ App Generation**: Generate ERPNext apps from PRD content
- **📋 PRD Analysis**: Analyze Product Requirement Documents
- **🛡️ Role-Based Access**: Read access for all authenticated users, write access for specific GitHub users
- **☁️ Cloud Deploy**: Deploy to Cloudflare Workers for global access

## Quick Setup

### 1. Install Dependencies

```bash
cd /Users/mekdesyared/erpnext-app-builder/mcp-remote-server
npm install
```

### 2. Setup Environment Variables

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with your configuration:

- **GitHub OAuth**: Create a GitHub OAuth app at https://github.com/settings/developers
- **Frappe API**: Generate API keys in your Frappe instance
- **Encryption Key**: Generate with `openssl rand -hex 32`

### 3. Install Wrangler CLI

```bash
npm install -g wrangler
wrangler login
```

### 4. Run Locally

```bash
npm run dev
```

Your server will be available at `http://localhost:8787`

## Configuration

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App:
   - **Homepage URL**: `http://localhost:8787` (for development)
   - **Callback URL**: `http://localhost:8787/callback`
3. Copy Client ID and Client Secret to `.dev.vars`

### Frappe API Setup

1. In your Frappe instance, go to **API Secret** doctype
2. Create new API Secret
3. Copy the API Key and API Secret to `.dev.vars`

### Access Control

Edit `src/index.ts` to add GitHub usernames for write access:

```typescript
const ALLOWED_USERNAMES = new Set([
  'mekdesyared',     // Your GitHub username
  'teammate1',       // Add team members
  // Add more usernames as needed
]);
```

## Available Tools

### Read Tools (All Authenticated Users)

- **`get_document`**: Retrieve a specific Frappe document
- **`list_documents`**: List documents with filters and pagination
- **`get_doctype_schema`**: Get DocType schema information
- **`analyze_prd`**: Analyze PRD content

### Write Tools (Privileged Users Only)

- **`create_document`**: Create new Frappe documents
- **`update_document`**: Update existing documents
- **`generate_app`**: Generate ERPNext apps from PRD

## Testing

Test your server using the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector):

```bash
npx @modelcontextprotocol/inspector@latest
```

Connect to: `http://localhost:8787/mcp`

## Production Deployment

### 1. Create KV Namespace

```bash
wrangler kv namespace create "OAUTH_KV"
```

Update the KV ID in `wrangler.jsonc`

### 2. Set Production Secrets

```bash
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put COOKIE_ENCRYPTION_KEY
wrangler secret put FRAPPE_BASE_URL
wrangler secret put FRAPPE_API_KEY
wrangler secret put FRAPPE_API_SECRET
```

### 3. Deploy

```bash
npm run deploy
```

### 4. Update GitHub OAuth App

Create a production OAuth app with:
- **Homepage URL**: `https://your-worker-name.your-subdomain.workers.dev`
- **Callback URL**: `https://your-worker-name.your-subdomain.workers.dev/callback`

## Usage with Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "erpnext-app-builder": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://your-worker-name.your-subdomain.workers.dev/mcp"
      ]
    }
  }
}
```

## Security

- All operations require GitHub authentication
- Write operations restricted to specific GitHub usernames
- Frappe API calls use secure token authentication
- All requests logged with user context

## Architecture

- **Cloudflare Workers**: Serverless runtime
- **Durable Objects**: Persistent state management
- **GitHub OAuth**: User authentication
- **Frappe API**: Backend integration
- **MCP Protocol**: Tool communication

## Troubleshooting

1. **Authentication Issues**: Check GitHub OAuth app configuration
2. **Frappe Connection**: Verify API keys and base URL
3. **Tools Not Available**: Ensure authentication completed successfully
4. **Write Access Denied**: Check if GitHub username is in ALLOWED_USERNAMES
