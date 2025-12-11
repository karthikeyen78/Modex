# How to Fix Vercel 404 Error

The **404: NOT_FOUND** error happens because Vercel is looking for your website in the wrong folder. Your website code is inside the `Modex task/frontend` folder, but Vercel looks in the main folder by default.

## Solution: Update Root Directory

Follow these exact steps in your browser:

1.  **Open Vercel Dashboard**: Go to [vercel.com](https://vercel.com) and log in.
2.  **Select Project**: Click on your **Modex** project.
3.  **Go to Settings**: Click the **Settings** tab at the top of the page.
4.  **General Settings**: You should be in the "General" section (left sidebar).
5.  **Find "Root Directory"**: Scroll down until you see the **Root Directory** section.
6.  **Edit**:
    *   Click the **Edit** button next to propert.
    *   Type exactly: `Modex task/frontend`
    *   Click **Save**.
7.  **Redeploy**:
    *   Go to the **Deployments** tab (top menu).
    *   Find the latest deployment (top one).
    *   Click the **three dots (⋮)** on the right.
    *   Select **Redeploy**.
    *   Click **Redeploy** again in the popup to confirm.

## Why this works
This tells Vercel: "Hey, my website code isn't at the very top, it's inside the 'frontend' folder. Go there specifically to build it!"

Once the redeployment finishes (wait ~1 minute), your site should be live.
