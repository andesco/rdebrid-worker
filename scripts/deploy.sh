#!/bin/bash
set -e

echo "🚀 Preparing for deployment..."

# Build client assets if we're in dev mode (check if package.dev.json exists as main package.json)
if grep -q "@heroui/react" package.json 2>/dev/null; then
  echo "📦 Building client assets..."
  npm run build:client || {
    echo "❌ Build failed!"
    exit 1
  }
fi

# Switch back to deployment package.json
if [ -f "package.deploy.json" ]; then
  echo "🔄 Switching to deployment mode..."
  cp package.json package.dev.json  # Save any changes to dev package.json
  cp package.deploy.json package.json
  
  # Install deployment dependencies
  echo "📦 Installing deployment dependencies..."
  npm install
fi

# Comment out build section in wrangler.toml for deployment
echo "⚙️  Configuring wrangler for deployment..."
sed -i.bak 's/^\[build\]/# [build]/' wrangler.toml
sed -i.bak 's/^command = "npm run build:client"/# command = "npm run build:client"/' wrangler.toml
sed -i.bak 's/^# Build enabled for development/# Uncomment above for development builds/' wrangler.toml
rm -f wrangler.toml.bak

# Deploy
echo "🚀 Deploying to Cloudflare Workers..."
wrangler deploy

echo "✅ Deployment successful!"
echo ""
echo "To return to development mode, run: ./scripts/dev-mode.sh"