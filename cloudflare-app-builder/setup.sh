#!/bin/bash

echo "🚀 Setting up Cloudflare Frappe App Builder"
echo "=========================================="

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed" 
    exit 1
fi

# Install Wrangler if not present
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

# Create environment file
if [ ! -f ".dev.vars" ]; then
    echo "📝 Creating environment configuration..."
    cp .dev.vars.example .dev.vars
    echo "⚠️  Please edit .dev.vars with your actual configuration"
else
    echo "✅ Environment file already exists"
fi

# Generate encryption key if needed
if grep -q "your_random_encryption_key" .dev.vars; then
    echo "🔐 Generating encryption key..."
    if command -v openssl &> /dev/null; then
        ENCRYPTION_KEY=$(openssl rand -hex 32)
        sed -i.bak "s/your_random_encryption_key/$ENCRYPTION_KEY/" .dev.vars
        rm -f .dev.vars.bak
        echo "✅ Encryption key generated"
    else
        echo "⚠️  Please manually generate encryption key: openssl rand -hex 32"
    fi
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. 🔧 Configure your credentials in .dev.vars:"
echo "   - GitHub OAuth App (create at https://github.com/settings/developers)"
echo "   - Frappe Cloud API credentials"
echo "   - Add your GitHub username to ALLOWED_BUILDERS"
echo ""
echo "2. 🔑 Login to Cloudflare:"
echo "   wrangler login"
echo ""
echo "3. 🗄️  Create required resources:"
echo "   # Create KV namespaces"
echo "   wrangler kv namespace create \"OAUTH_KV\""
echo "   wrangler kv namespace create \"APP_STORAGE\""
echo "   "
echo "   # Create R2 bucket"
echo "   wrangler r2 bucket create frappe-apps-storage"
echo "   "
echo "   # Update wrangler.jsonc with the returned IDs"
echo ""
echo "4. 🧪 Test locally:"
echo "   npm run dev"
echo ""
echo "5. 🚀 Deploy to production:"
echo "   npm run deploy"
echo ""
echo "GitHub OAuth App Configuration:"
echo "- Homepage URL: http://localhost:8787 (dev) or https://your-worker.workers.dev (prod)"
echo "- Callback URL: http://localhost:8787/callback (dev) or https://your-worker.workers.dev/callback (prod)"
