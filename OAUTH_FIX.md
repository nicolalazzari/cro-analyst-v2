# Fix OAuth "Client Not Found" Error

## Error: "OAuth client was not found" (401: invalid_client)

This error occurs when the redirect URI is not configured in Google Cloud Console.

## Solution

### Step 1: Verify Client ID
Your current Client ID should match the one in your Vercel environment variables

### Step 2: Add Redirect URI in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID (it should match your `GOOGLE_CLIENT_ID` environment variable)
5. Click **Edit** (pencil icon)
6. Under **Authorized redirect URIs**, click **+ ADD URI**
7. Add this EXACT URI:
   ```
   https://cro-analyst-v2-new-nicolalazzarigmailcoms-projects.vercel.app/api/auth/callback/google
   ```
8. Click **Save**

### Step 3: Wait and Test

1. Wait 2-3 minutes for changes to propagate
2. Try logging in again at: https://cro-analyst-v2-new.vercel.app/auth/signin

## Important Notes

- The redirect URI must match EXACTLY (including https, no trailing slash)
- Changes in Google Cloud Console can take a few minutes to propagate
- Make sure you're editing the correct OAuth client (the one matching your Client ID)

## Current Configuration

- **Client ID**: Check your Vercel environment variables for `GOOGLE_CLIENT_ID`
- **Client Secret**: Check your Vercel environment variables for `GOOGLE_CLIENT_SECRET`
- **Required Redirect URI**: `https://cro-analyst-v2-new-nicolalazzarigmailcoms-projects.vercel.app/api/auth/callback/google`

