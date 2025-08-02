# Vercel Deployment Guide

## Environment Variables Setup

To deploy your Felex-Manager application on Vercel, you need to configure the following environment variables in your Vercel project settings:

### Required Environment Variables

1. **VITE_SUPABASE_URL**
   - Value: `https://r3sllt3kgzbmxtbaoooyxyw.supabase.co`

2. **VITE_SUPABASE_ANON_KEY**
   - Value: `sb_publishable_R3SlLT3kgZBMXTbaOoyxYw_Z8SwBW_d`

### How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project (Felex-Manager)
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://r3sllt3kgzbmxtbaoooyxyw.supabase.co`
   - **Environment**: Production, Preview, Development

   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `sb_publishable_R3SlLT3kgZBMXTbaOoyxYw_Z8SwBW_d`
   - **Environment**: Production, Preview, Development

5. Click **Save**

### Build Configuration

The `vercel.json` file is now properly configured for a Vite React application:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  }
}
```

### Deployment Steps

1. Ensure all environment variables are set in Vercel
2. Push your changes to the main branch
3. Vercel will automatically trigger a new deployment
4. Monitor the deployment logs for any issues

### Troubleshooting

If you encounter the "Function Runtimes must have a valid version" error:
- This has been fixed by removing the unnecessary functions configuration
- The current `vercel.json` is properly configured for a static React app

### Local Development

For local development, create a `.env.local` file in your project root:

```
VITE_SUPABASE_URL=https://r3sllt3kgzbmxtbaoooyxyw.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_R3SlLT3kgZBMXTbaOoyxYw_Z8SwBW_d
```

This file is already in `.gitignore` and won't be committed to your repository. 