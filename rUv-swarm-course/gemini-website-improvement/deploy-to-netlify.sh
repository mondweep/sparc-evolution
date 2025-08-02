#!/bin/bash

# rUv-Swarm Learning Platform - Netlify Deployment Script
# This script automates the deployment process to Netlify

echo "🚀 rUv-Swarm Learning Platform - Netlify Deployment"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the application
echo "🏗️  Building production version..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Build directory 'dist' not found"
    exit 1
fi

echo "📊 Build Statistics:"
echo "   HTML: $(ls -lh dist/index.html | awk '{print $5}')"
echo "   CSS:  $(ls -lh dist/assets/*.css | awk '{print $5}')"
echo "   JS:   $(ls -lh dist/assets/*.js | awk '{print $5}')"

# Check if Netlify CLI is installed
if command -v netlify &> /dev/null; then
    echo ""
    echo "🌐 Netlify CLI detected. Options:"
    echo "   1. Deploy to production: netlify deploy --dir=dist --prod"
    echo "   2. Deploy preview: netlify deploy --dir=dist"
    echo ""
    read -p "Deploy to Netlify now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Deploying to Netlify..."
        netlify deploy --dir=dist --prod
    fi
else
    echo ""
    echo "📋 Manual Deployment Instructions:"
    echo "   1. Go to https://app.netlify.com/drop"
    echo "   2. Drag and drop the 'dist' folder"
    echo "   OR"
    echo "   1. Install Netlify CLI: npm install -g netlify-cli"
    echo "   2. Login: netlify login"
    echo "   3. Deploy: netlify deploy --dir=dist --prod"
fi

echo ""
echo "🎉 Deployment Preparation Complete!"
echo ""
echo "📚 Your rUv-Swarm Learning Platform includes:"
echo "   ✅ 4 comprehensive courses"
echo "   ✅ 12+ interactive visualizations"
echo "   ✅ Neural network and swarm intelligence content"
echo "   ✅ Progressive Web App features"
echo "   ✅ SEO optimization"
echo "   ✅ Responsive design"
echo ""
echo "🌍 Once deployed, your platform will be available globally!"
echo "👨‍🏫 Course Creator: Mondweep Chakravorty"
echo "🔗 LinkedIn: https://www.linkedin.com/in/mondweepchakravorty"
echo ""
echo "Happy learning! 🧠✨"