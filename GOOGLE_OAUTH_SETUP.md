# Google OAuth Setup for CRO Analyst v2

## Issue: "OAuth client was not found" (Error 401: invalid_client)

This error occurs when the Google OAuth credentials are not configured correctly.

## Solution

### 1. Verify Environment Variables in Vercel

The following environment variables must be set correctly:

- `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret

**To find your values:**
- Check your v1 project's `.env` file for `GOOGLE_OAUTH2_CLIENT_ID` and `GOOGLE_OAUTH2_CLIENT_SECRET`
- Or create new credentials in Google Cloud Console

### 2. Configure Redirect URI in Google Cloud Console

**IMPORTANT:** You must add the correct redirect URI to your Google OAuth client.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID (it should match your `GOOGLE_CLIENT_ID` environment variable)
5. Click **Edit** (pencil icon)
6. Under **Authorized redirect URIs**, add:
   ```
   https://cro-analyst-v2-new-nicolalazzarigmailcoms-projects.vercel.app/api/auth/callback/google
   ```
7. Also add for local development (optional):
   ```
   http://localhost:3000/api/auth/callback/google
   ```
8. Click **Save**

### 3. Verify NextAuth Configuration

The NextAuth callback URL format is:
```
{APP_URL}/api/auth/callback/{PROVIDER}
```

For Google OAuth:
```
https://cro-analyst-v2-new-nicolalazzarigmailcoms-projects.vercel.app/api/auth/callback/google
```

### 4. Redeploy After Changes

After updating the redirect URI in Google Cloud Console:
1. Wait a few minutes for changes to propagate
2. Trigger a new deployment on Vercel (or wait for auto-deploy)
3. Test the login again

## Troubleshooting

### Error: "redirect_uri_mismatch"
- **Cause**: The redirect URI in Google Cloud Console doesn't match the one NextAuth is using
- **Solution**: Add the exact redirect URI shown above to Google Cloud Console

### Error: "invalid_client"
- **Cause**: Client ID or Secret is incorrect or missing
- **Solution**: 
  1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Vercel
  2. Make sure there are no extra spaces or newlines
  3. Redeploy the application

### Error: "access_denied"
- **Cause**: User denied permission or OAuth scopes are incorrect
- **Solution**: Check that the required scopes are configured in `frontend/app/api/auth/[...nextauth]/route.ts`

## Required OAuth Scopes

The application requires these scopes:
- `openid`
- `email`
- `profile`
- `https://www.googleapis.com/auth/drive.readonly`
- `https://www.googleapis.com/auth/spreadsheets.readonly`

These are already configured in the NextAuth setup.

## Testing

1. Go to your deployed app: `https://cro-analyst-v2-new-nicolalazzarigmailcoms-projects.vercel.app`
2. Click "Sign In with Google"
3. You should be redirected to Google's OAuth consent screen
4. After granting permissions, you should be redirected back to the app

