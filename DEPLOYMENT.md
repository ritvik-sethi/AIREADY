# Deployment Guide for ET AI Ready Platform

## Prerequisites

- Node.js 18+ installed locally
- A Neon database account (https://neon.tech)
- Vercel or Netlify account

## Environment Variables

The following environment variables are required for deployment:

```
VITE_STACK_PROJECT_ID=your_stack_project_id
VITE_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
STACK_SECRET_SERVER_KEY=your_secret_server_key
VITE_DATABASE_URL=your_neon_database_url
DATABASE_URL=your_neon_database_url
```

## Deployment Steps

### Option 1: Deploy to Vercel

1. **Push your code to GitHub** (if not already done)

2. **Import your repository in Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository

3. **Configure Environment Variables**:
   - In Vercel dashboard → Settings → Environment Variables
   - Add all the environment variables listed above
   - Make sure to add them for Production, Preview, and Development environments

4. **Deploy**:
   - Vercel will automatically deploy on every push to your repository
   - The build command is already configured in `vercel.json`

### Option 2: Deploy to Netlify

1. **Push your code to GitHub** (if not already done)

2. **Import your repository in Netlify**:
   - Go to https://app.netlify.com/start
   - Connect to your Git provider and select your repository

3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - These are already configured in `netlify.toml`

4. **Configure Environment Variables**:
   - In Netlify dashboard → Site settings → Environment variables
   - Add all the environment variables listed above

5. **Deploy**:
   - Click "Deploy site"
   - Netlify will automatically deploy on every push to your repository

## Database Setup

The application requires a Neon PostgreSQL database. If you haven't set it up yet:

1. Create a Neon database at https://neon.tech
2. Get your connection string
3. Run the database migrations:
   ```bash
   npm run db:push
   ```
4. Seed the database with initial data:
   ```bash
   npm run db:setup
   ```

## Troubleshooting

### Blank Screen After Deployment

If you see a blank screen after deployment:

1. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Check for JavaScript errors

2. **Verify Environment Variables**:
   - Make sure all environment variables are set correctly
   - Environment variables must start with `VITE_` to be accessible in the browser
   - Redeploy after adding/updating environment variables

3. **Check Build Logs**:
   - Review the build logs in Vercel/Netlify dashboard
   - Look for any build errors or warnings

4. **Verify Database Connection**:
   - Ensure `VITE_DATABASE_URL` is set correctly
   - Test the database connection string locally first

5. **Check Routing**:
   - The `vercel.json` and `netlify.toml` files handle SPA routing
   - Make sure these files are committed to your repository

### Common Issues

**Issue**: "DATABASE_URL is not set"
**Solution**: Add `VITE_DATABASE_URL` environment variable in your deployment platform

**Issue**: 404 on page refresh
**Solution**: The `vercel.json` and `netlify.toml` files should handle this. Make sure they're in your repository root.

**Issue**: Environment variables not working
**Solution**:
- In Vite/React apps, only variables prefixed with `VITE_` are accessible in the browser
- Redeploy after adding environment variables

## Local Development

To run locally:

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your actual values

# Run development server
npm run dev
```

## Important Notes

- The `.env` file contains sensitive information and should never be committed to Git
- Always use `.env.example` as a template
- Update environment variables in your deployment platform when you change them
- The Neon HTTP driver allows browser-side database queries, which is safe for this application
