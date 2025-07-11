#!/bin/bash

echo "🚀 ERPNext App Builder - Remote MCP Server Setup"
echo "================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the mcp-remote-server directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .dev.vars exists
if [ ! -f ".dev.vars" ]; then
    echo "📝 Creating .dev.vars from example..."
    cp .dev.vars.example .dev.vars
    echo "⚠️  Please edit .dev.vars with your actual configuration values"
else
    echo "✅ .dev.vars already exists"
fi

# Generate encryption key if needed
if ! grep -q "your_random_encryption_key" .dev.vars; then
    echo "✅ Encryption key already configured"
else
    echo "🔐 Generating encryption key..."
    if command -v openssl &> /dev/null; then
        ENCRYPTION_KEY=$(openssl rand -hex 32)
        sed -i.bak "s/your_random_encryption_key/$ENCRYPTION_KEY/" .dev.vars
        rm -f .dev.vars.bak
        echo "✅ Encryption key generated and added to .dev.vars"
    else
        echo "⚠️  Please manually generate an encryption key with: openssl rand -hex 32"
    fi
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Edit .dev.vars with your GitHub OAuth and Frappe credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Test with MCP Inspector: npx @modelcontextprotocol/inspector@latest"
echo ""
echo "For production deployment:"
echo "1. Run 'wrangler login' to authenticate with Cloudflare"
echo "2. Create KV namespace: wrangler kv namespace create \"OAUTH_KV\""
echo "3. Update wrangler.jsonc with the KV ID"
echo "4. Set production secrets with 'wrangler secret put'"
echo "5. Deploy with 'npm run deploy'"
