#!/bin/bash

# Claude Flow Configuration Course - Netlify Deployment Script
echo "🚀 Deploying Claude Flow Configuration Course to Netlify..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the interactive-app directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Build the application
echo "🏗️  Building application for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Copy redirect file to dist
echo "📋 Copying configuration files..."
cp _redirects dist/

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "⚠️  Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
echo "📝 Note: You'll need to:"
echo "   1. Link this directory to a Netlify site (netlify link)"
echo "   2. Or create a new site (netlify sites:create)"
echo "   3. Then deploy with: netlify deploy --prod --dir=dist"
echo ""
echo "✅ Build completed successfully!"
echo "📁 Built files are in the 'dist' directory"
echo ""
echo "🚀 Quick deploy options:"
echo "   Option 1 - Drag & Drop: Upload the 'dist' folder to https://app.netlify.com/drop"
echo "   Option 2 - CLI: Run 'netlify deploy --prod --dir=dist' from this directory"
echo "   Option 3 - Git: Push to GitHub and connect via Netlify dashboard"
echo ""
echo "🎯 Your Claude Flow Configuration Course is ready for deployment!"