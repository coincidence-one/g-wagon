---
description: How to deploy the G-Wagon (Next.js) application to Vercel.
---

# Deploying G-Wagon to Vercel

Since this is a Next.js application with Supabase, **Vercel** is the easiest and most robust hosting option.

## Prerequisites

1.  **GitHub Repository**: Ensure your code is pushed to a GitHub repository.
2.  **Supabase Project**: You clearly already have this.
3.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) using your GitHub account.

## Step-by-Step Guide

### 1. Import Project to Vercel

1.  Go to the Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2.  Select your GitHub repository (`px` or whatever you named it).
3.  Click **Import**.

### 2. Configure Environment Variables

Expand the **"Environment Variables"** section before clicking deploy. You need to copy the keys from your local `.env.local` file.

Add the following keys:

- `NEXT_PUBLIC_SUPABASE_URL`: (Copy from your .env.local)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Copy from your .env.local)
- `NEXT_PUBLIC_NAVER_CLIENT_ID`: (For Naver Maps)
- `NEXT_PUBLIC_KAKAO_APP_KEY`: (For Kakao Maps)

> [!IMPORTANT]
> Do NOT paste the keys into the code directly. Always use Environment Variables for security.

### 3. Deploy

1.  Click **Deploy**.
2.  Wait for the build to complete (usually 1-2 minutes).
3.  Once finished, you will get a production URL (e.g., `g-wagon.vercel.app`).

### 4. Post-Deployment Setup (Critical)

#### Supabase Auth URL

1.  Go to your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
2.  Add your new Vercel URL (e.g., `https://g-wagon.vercel.app`) to the **Site URL** or **Redirect URLs**.
3.  If you don't do this, login will fail in the deployed app!

#### Naver/Kakao Keys

1.  **Naver Cloud Console**: Add your Vercel domain to the "Web Service URL" settings.
2.  **Kakao Developers**: Add your Vercel domain to "Platform" -> "Web" settings.
