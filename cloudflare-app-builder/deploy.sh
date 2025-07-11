#!/bin/bash

echo "🚀 Deploying Cloudflare Frappe App Builder"
echo "========================================="

# Check if logged in to Cloudflare
if ! wrangler whoami > /dev/null 2>&1; then
    echo "❌ Please login to Cloudflare first:"
    echo "wrangler login"
    exit 1
fi

echo "📋 Pre-deployment checklist:"
echo ""

# Check if environment is configured
if [ ! -f ".dev.vars" ]; then
    echo "❌ .dev.vars file not found. Run ./setup.sh first"
    exit 1
fi

# Check for required secrets in production
echo "🔍 Checking production secrets..."
REQUIRED_SECRETS=(
    "GITHUB_CLIENT_ID"
    "GITHUB_CLIENT_SECRET" 
    "COOKIE_ENCRYPTION_KEY"
    "FRAPPE_CLOUD_API_KEY"
    "FRAPPE_CLOUD_API_SECRET"
    "ALLOWED_BUILDERS"
)

echo "Please ensure these secrets are set in production:"
for secret in "${REQUIRED_SECRETS[@]}"; do
    echo "  - $secret"
done

echo ""
read -p "Have you set all production secrets? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Set secrets with:"
    for secret in "${REQUIRED_SECRETS[@]}"; do
        echo "wrangler secret put $secret"
    done
    exit 1
fi

# Check KV namespaces
echo ""
echo "🗄️  Checking KV namespaces..."
if grep -q "<Add-KV-ID>" wrangler.jsonc; then
    echo "❌ Please update KV namespace IDs in wrangler.jsonc"
    echo "Create with:"
    echo "wrangler kv namespace create \"OAUTH_KV\""
    echo "wrangler kv namespace create \"APP_STORAGE\""
    exit 1
fi

# Check R2 bucket
echo ""
echo "🪣 Checking R2 bucket..."
echo "Ensure 'frappe-apps-storage' R2 bucket exists"
read -p "Is the R2 bucket created? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Create with: wrangler r2 bucket create frappe-apps-storage"
    exit 1
fi

# Type check
echo ""
echo "🔍 Running type check..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Type check failed. Please fix errors first."
    exit 1
fi

# Deploy
echo ""
echo "🚀 Deploying to Cloudflare..."
wrangler deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📋 Post-deployment steps:"
    echo ""
    echo "1. 🔧 Update GitHub OAuth App for production:"
    echo "   - Homepage URL: https://your-worker.your-subdomain.workers.dev"
    echo "   - Callback URL: https://your-worker.your-subdomain.workers.dev/callback"
    echo ""
    echo "2. 🧪 Test your deployment:"
    echo "   npx @modelcontextprotocol/inspector@latest"
    echo "   Connect to: https://your-worker.your-subdomain.workers.dev/mcp"
    echo ""
    echo "3. 🖥️  Add to Claude Desktop config:"
    echo '   {
     "mcpServers": {
       "cloudflare-app-builder": {
         "command": "npx",
         "args": [
           "mcp-remote",
           "https://your-worker.your-subdomain.workers.dev/mcp"
         ]
       }
     }
   }'
    echo ""
    echo "4. 🎯 Start building apps with Claude:"
    echo '   "Build a simple task management app with Task and Project DocTypes"'
else
    echo "❌ Deployment failed!"
    exit 1
fi
