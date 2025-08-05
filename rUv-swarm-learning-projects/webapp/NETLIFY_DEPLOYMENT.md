# Netlify Deployment Guide

## 🚀 Deploy rUv-Swarm Interactive Learning Webapp to Netlify

### **Method 1: Drag & Drop Deployment (Quickest)**

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Go to Netlify:**
   - Visit [netlify.com](https://netlify.com)
   - Log in to your account (or create one)

3. **Deploy:**
   - Drag the entire `dist` folder to the Netlify deploy area
   - Wait for deployment to complete
   - Your app will be live at `https://random-name.netlify.app`

4. **Customize site name (optional):**
   - Go to Site Settings → Change site name
   - Choose something like `ruv-swarm-learning` or `ruv-swarm-interactive`

---

### **Method 2: Git-based Deployment (Recommended for updates)**

1. **Push code to GitHub:**
   ```bash
   # If not already a git repository
   git init
   git add .
   git commit -m "Initial commit: rUv-swarm interactive learning webapp"
   
   # Create GitHub repository and push
   git remote add origin https://github.com/YOUR-USERNAME/ruv-swarm-learning-webapp.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com) → New site from Git
   - Choose GitHub → Select your repository
   - Configure build settings:
     - **Base directory:** `rUv-swarm-learning-projects/webapp`
     - **Build command:** `npm run build`
     - **Publish directory:** `rUv-swarm-learning-projects/webapp/dist`

3. **Deploy:**
   - Click "Deploy site"
   - Automatic deployments on every push to main branch

---

### **Method 3: Netlify CLI (For developers)**

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login and deploy:**
   ```bash
   # Build the project
   npm run build
   
   # Login to Netlify
   netlify login
   
   # Deploy (first time)
   netlify deploy --dir=dist
   
   # Deploy to production
   netlify deploy --prod --dir=dist
   ```

---

## 🔧 Configuration Files

The webapp includes these Netlify configuration files:

### **netlify.toml**
- **Build settings:** Automated build configuration
- **Redirects:** SPA routing support (all routes → index.html)
- **Headers:** Security and caching headers
- **Environment:** Node.js version specification

### **Key Features:**
- ✅ **SPA Routing:** All routes work correctly (/, /projects, /project/1, etc.)
- ✅ **Security Headers:** XSS protection, content security policy
- ✅ **Caching:** Optimized asset caching for performance
- ✅ **Build Optimization:** Automatic builds from Git

---

## 🌐 Expected Deployment Result

Your webapp will be available at a URL like:
- `https://ruv-swarm-learning.netlify.app`
- `https://ruv-swarm-interactive.netlify.app`
- Or a custom domain if you configure one

### **Live Features:**
- ✅ **All 7 interactive projects** working correctly
- ✅ **Progress tracking** with local storage
- ✅ **Interactive terminal** and code editor
- ✅ **Responsive design** on all devices  
- ✅ **Course curator attribution** on all pages
- ✅ **Repository links** to rUv-swarm GitHub

---

## 🎯 Post-Deployment Checklist

After deployment, verify:

- [ ] **Homepage loads** correctly
- [ ] **All projects accessible** via /projects page
- [ ] **Individual project pages** work (/project/1, /project/2, etc.)
- [ ] **Interactive features** working:
  - [ ] Terminal commands execute
  - [ ] Code editor functions
  - [ ] Progress tracking saves
  - [ ] Concept explanations expand
- [ ] **Footer displays** course curator and repository links
- [ ] **Links open** in new tabs correctly
- [ ] **Mobile responsive** on different screen sizes

---

## 🔗 Integration with Existing Ecosystem

Once deployed, you can:

1. **Link from main tutorial site:**
   ```html
   <a href="https://your-netlify-url.netlify.app" target="_blank">
     🎮 Try Interactive Learning Projects
   </a>
   ```

2. **Embed as iframe:**
   ```html
   <iframe 
     src="https://your-netlify-url.netlify.app" 
     width="100%" 
     height="800px"
     frameborder="0">
   </iframe>
   ```

3. **Reference in documentation:**
   - Update ruv-swarm-tutorial.netlify.app to include link
   - Add to GitHub repository README
   - Include in course materials

---

## 🚀 Quick Deploy Commands

```bash
# Build for production
npm run build

# Deploy via CLI (if using Netlify CLI)
netlify deploy --prod --dir=dist

# Or simply drag the 'dist' folder to netlify.com
```

---

## 🎓 Course Curator Information

The webapp now includes on every page:
- **Course Curator:** Mondweep Chakravorty (LinkedIn profile link)
- **Repository Reference:** Links to rUv-swarm GitHub repository
- **Attribution:** Clear crediting for educational content

---

**Ready to deploy!** Choose your preferred method above and your interactive rUv-swarm learning webapp will be live on Netlify! 🚀