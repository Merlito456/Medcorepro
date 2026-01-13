# 🚀 Deploying MedCore Pro to Cloudflare Pages

This guide provides step-by-step instructions to deploy the **MedCore Pro - Clinic Management System** to Cloudflare Pages.

## 📋 Prerequisites
1. A [Cloudflare Account](https://dash.cloudflare.com/sign-up).
2. Your project code pushed to a Git provider (GitHub or GitLab).
3. Your Gemini API Key (for Clinical AI features).

## 🛠️ Deployment Steps

### 1. Create a New Project
1. Log in to the Cloudflare Dashboard.
2. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.

### 2. Configure Build Settings
Cloudflare detects most settings, but ensure they match the following for this project:

- **Framework preset**: `None` (or `Vite` if you have added a vite config)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (Project Root)

### 3. Set Environment Variables
The application requires the Gemini API key to function. 
1. During the setup process (or in **Settings** > **Environment variables** later), add the following:
   - **Variable Name**: `API_KEY`
   - **Value**: `your_gemini_api_key_here`

### 4. Configure Single Page Application (SPA) Redirects
Since this app uses client-side routing, you need to ensure Cloudflare doesn't return 404s on page refresh. 
Create a file named `_redirects` in your `public/` or build folder with the following content:
```text
/*  /index.html  200
```

## 🔒 Security & Privacy Notes
- **Data Residency**: This app utilizes Supabase. Ensure your Supabase project is set to a region compliant with your local health data regulations (e.g., Singapore for PH clinics).
- **Environment Variables**: Never commit your `API_KEY` to your Git repository. Always use Cloudflare's encrypted environment variables.

## ⚡ Troubleshooting
- **Build Errors**: Ensure all dependencies are listed in `package.json`.
- **Service Worker**: The `sw.js` is configured for local pathing. If your deployment is in a subfolder, update the `navigator.serviceWorker.register` path in `index.html`.
- **API Failures**: If the AI Lab returns errors, check if the `API_KEY` is correctly set in the "Production" environment variable section in Cloudflare.

---
*MedCore Pro is a professional-grade DCMS. For production use, ensure you have signed a Data Processing Agreement (DPA) with your cloud providers.*
