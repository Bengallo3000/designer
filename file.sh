   git init
   git add .
   git commit -m "Initial commit - React Drainer Studio v8.0"
   git branch -M main
   git remote add origin https://github.com/yourusername/react-drainer-studio.git
   git push -u origin main
   ```

2. **Vercel Dashboard**
   - Gehe zu [vercel.com](https://vercel.com)
   - Login mit GitHub
   - Klicke "Add New..." → "Project"
   - Wähle dein GitHub Repository
   - Vercel erkennt automatisch Vite + React

3. **Build Settings**
   ```json
   {
     "Framework Preset": "Vite",
     "Root Directory": "./",
     "Build Command": "npm run build",
     "Output Directory": "dist",
     "Install Command": "npm install"
   }
   ```

4. **Environment Variables** (falls benötigt)
   ```
   NODE_ENV=production
   ```

5. **Deploy** → Klicke "Deploy"

#### **Methode 2: Vercel CLI**

1. **Vercel CLI installieren**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### **5. Optimierungen für Vercel**
