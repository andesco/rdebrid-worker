#!/usr/bin/env node

/**
 * Smart deployment script that handles dependency switching automatically
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function log(message) {
  console.log(`🚀 ${message}`);
}

function restorePackageJson() {
  if (fs.existsSync('package.deploy.json')) {
    log('Restoring deployment package.json...');
    fs.copyFileSync('package.deploy.json', 'package.json');
    fs.unlinkSync('package.deploy.json');
  }
}

// Ensure we restore package.json even if script fails
process.on('exit', restorePackageJson);
process.on('SIGINT', () => {
  restorePackageJson();
  process.exit();
});

try {
  log('Setting up deployment environment...');
  
  // Backup current package.json and switch to deployment version
  fs.copyFileSync('package.json', 'package.deploy.backup.json');
  fs.copyFileSync('package.dev.json', 'package.json');
  
  // Install dependencies
  log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build client if needed
  if (process.argv.includes('--build')) {
    log('Building client assets...');
    execSync('npm run build:client', { stdio: 'inherit' });
  }
  
  // Restore deployment package.json
  fs.copyFileSync('package.deploy.backup.json', 'package.json');
  fs.unlinkSync('package.deploy.backup.json');
  
  // Deploy
  log('Deploying to Cloudflare Workers...');
  execSync('wrangler deploy', { stdio: 'inherit' });
  
  log('✅ Deployment successful!');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  
  // Restore package.json on error
  if (fs.existsSync('package.deploy.backup.json')) {
    fs.copyFileSync('package.deploy.backup.json', 'package.json');
    fs.unlinkSync('package.deploy.backup.json');
  }
  
  process.exit(1);
}