#!/bin/bash

# rUv-Swarm Interactive Learning Webapp - Netlify Deployment Script
# Course Curator: Mondweep Chakravorty

echo "🐝 rUv-Swarm Interactive Learning Webapp - Netlify Deployment"
echo "=============================================================="
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the webapp directory"
    echo "   cd rUv-swarm-learning-projects/webapp"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🏗️  Building production version..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Next steps for Netlify deployment:"
    echo ""
    echo "Method 1 - Drag & Drop:"
    echo "  1. Go to https://netlify.com"
    echo "  2. Drag the 'dist' folder to the deploy area"
    echo "  3. Wait for deployment to complete"
    echo ""
    echo "Method 2 - Netlify CLI:"
    echo "  1. npm install -g netlify-cli"
    echo "  2. netlify login"
    echo "  3. netlify deploy --dir=dist --prod"
    echo ""
    echo "Method 3 - Git-based:"
    echo "  1. Push code to GitHub"
    echo "  2. Connect GitHub repo to Netlify"
    echo "  3. Set build command: npm run build"
    echo "  4. Set publish directory: dist"
    echo ""
    echo "📁 Your built files are ready in the 'dist' directory"
    echo "🎓 Course Curator: Mondweep Chakravorty"
    echo "🔗 Repository: https://github.com/ruvnet/ruv-FANN/tree/main/ruv-swarm"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi