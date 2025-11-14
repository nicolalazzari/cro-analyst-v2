# How to View and Set Environment Variables in Vercel

## Finding Environment Variables in Vercel Dashboard

### Step-by-Step Guide:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Make sure you're logged in

2. **Select Your Project**
   - Look for project: **cro-analyst-v2-new**
   - Click on the project name

3. **Navigate to Settings**
   - In the project page, click on **"Settings"** tab (top navigation)
   - Or go directly to: `https://vercel.com/[your-team]/cro-analyst-v2-new/settings`

4. **Go to Environment Variables**
   - In the Settings page, click on **"Environment Variables"** in the left sidebar
   - Or scroll down to find the "Environment Variables" section

5. **View/Add Variables**
   - You'll see a list of existing environment variables (if any)
   - Click **"Add New"** or **"Add"** button to add new variables

## If You Don't See the Project

### Check:
1. **Correct Account**: Make sure you're logged into the correct Vercel account
2. **Project Name**: The project might be named differently
3. **Team/Organization**: Check if the project is under a team/organization

### Find Your Project:
1. Go to https://vercel.com/dashboard
2. Look in the projects list
3. Search for "cro-analyst" or "cro-analyst-v2"
4. Check both "Personal" and any "Teams" sections

## If Environment Variables Section is Empty

This is normal if you haven't added any yet! You need to add them manually.

### Quick Add via Dashboard:

1. Click **"Add New"** button
2. Enter variable name (e.g., `DATABASE_URL`)
3. Enter variable value
4. Select environments: Production, Preview, Development (or all)
5. Click **"Save"**

## Alternative: Check via CLI

If you have Vercel CLI installed and project linked:

```bash
cd frontend
vercel env ls
```

This will show all environment variables for the project.

## Troubleshooting

### Can't find Settings tab?
- Make sure you have access/permissions to the project
- Check if you're the project owner or have admin access

### Project not showing?
- The project might be under a different name
- Check your Vercel teams/organizations
- Try searching in the dashboard

### Need to create project first?
If the project doesn't exist:
1. Go to https://vercel.com/new
2. Import from GitHub: `nicolalazzari/cro-analyst-v2`
3. Set Root Directory to: `frontend`
4. Then add environment variables

## Direct Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Projects**: https://vercel.com/dashboard/projects
- **Environment Variables Docs**: https://vercel.com/docs/concepts/projects/environment-variables

## Quick Checklist

- [ ] Logged into Vercel
- [ ] Found project "cro-analyst-v2-new" (or similar)
- [ ] Clicked on project
- [ ] Went to Settings tab
- [ ] Clicked "Environment Variables" in sidebar
- [ ] See "Add New" button

If you've done all these and still don't see it, let me know what you see instead!

