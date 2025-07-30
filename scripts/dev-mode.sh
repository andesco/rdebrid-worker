#!/bin/bash
set -e

echo "🔧 Switching to development mode..."

# Backup deployment package.json
if [ ! -f "package.deploy.json" ]; then
  cp package.json package.deploy.json
fi

# Switch to development package.json
cp package.dev.json package.json

# Install all dependencies
echo "📦 Installing development dependencies..."
npm install

# Uncomment build section in wrangler.toml
sed -i.bak 's/^# \[build\]/[build]/' wrangler.toml
sed -i.bak 's/^# command = "npm run build:client"/command = "npm run build:client"/' wrangler.toml
sed -i.bak 's/^# Uncomment above for development builds/# Build enabled for development/' wrangler.toml
rm -f wrangler.toml.bak

echo "✅ Development mode enabled!"
echo ""
echo "You can now use:"
echo "  npm run client    # Start dev server"
echo "  npm run build:client  # Build assets"  
echo "  npm run typecheck # Type checking"
echo ""
echo "When ready to deploy, run: ./scripts/deploy.sh"