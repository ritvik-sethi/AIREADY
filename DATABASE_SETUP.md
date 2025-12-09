# 🗄️ Neon Database Setup Guide

Complete guide to set up and use Neon PostgreSQL database for your AI Ready Certification Platform.

## 📋 Prerequisites

- Node.js installed (you already have this ✅)
- A Neon account (we'll create this)

---

## 🚀 Step-by-Step Setup

### Step 1: Create Neon Account & Database

1. **Visit Neon.tech**
   - Go to: https://neon.tech
   - Click "Sign Up" (use GitHub, Google, or Email)

2. **Create Your Project**
   - After login, click **"Create Project"**
   - Project Name: `ai-ready-certification`
   - Region: Select closest to your location
   - Click **"Create Project"**

3. **Get Connection String**
   - After creation, you'll see a connection string
   - It looks like:
     ```
     postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/database?sslmode=require
     ```
   - **COPY THIS!** We need it next.

### Step 2: Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the DATABASE_URL with YOUR connection string from Neon:
   ```env
   DATABASE_URL=postgresql://YOUR_CONNECTION_STRING_HERE
   ```

### Step 3: Push Database Schema to Neon

This creates all the tables in your Neon database:

```bash
npm run db:push
```

You should see:
```
✅ Tables created successfully
```

### Step 4: Seed the Database

This migrates all your existing JSON data to the database:

```bash
npm run db:seed
```

You should see:
```
🌱 Starting database seeding...
📝 Seeding permissions...
👥 Seeding roles...
🎓 Seeding certification tracks...
📚 Seeding curriculum modules...
📝 Seeding mock tests...
👤 Seeding users...
✅ Database seeding completed successfully!
```

---

## 🎯 Available Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate migration files |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio (visual database browser) |
| `npm run db:seed` | Seed database with initial data |

---

## 🔍 View Your Database

### Option 1: Drizzle Studio (Recommended)

```bash
npm run db:studio
```

This opens a visual interface at `https://local.drizzle.studio` where you can:
- Browse all tables
- View data
- Run queries
- Edit records

### Option 2: Neon Console

1. Go to https://console.neon.tech
2. Select your project
3. Click "SQL Editor"
4. Run queries directly

---

## 📊 Database Structure

Your database now has these tables:

### Users Table
- Stores all user accounts (both regular users and admins)
- Includes profile, enrollment, and exam information

### Course Progress Table
- Tracks user progress through each module
- Overall progress percentage

### Mock Test Results Table
- Stores test scores and completion status

### Roles Table
- Admin role definitions
- Permission assignments

### Permissions Table
- All available permissions in the system

### Certification Tracks Table
- AI Leader, HR, Business Manager, Technical, Educator tracks
- Pricing, duration, competencies

### Modules Table
- All course curriculum modules
- Video and PDF URLs

### Mock Tests Table
- Test definitions and questions

---

## 🔄 Next Steps

Now you have TWO options:

### Option A: Keep Using JSON Files (Current)
- Your app still uses JSON files
- Database is set up but not connected to the app yet
- Good for testing

### Option B: Connect App to Database (Recommended)
- I can help you update the app to use the database
- All data will be saved to Neon instead of JSON
- Real-time updates
- Scalable

**Which option would you like to proceed with?**

---

## 🆘 Troubleshooting

### Error: "DATABASE_URL is not set"
- Check `.env` file exists
- Verify DATABASE_URL is correct
- Restart your dev server after changing .env

### Error: "Connection refused"
- Check your Neon connection string is correct
- Verify your internet connection
- Check Neon project is active

### Error: "Permission denied"
- Your Neon user needs proper permissions
- Check connection string includes credentials

### Seed fails with "duplicate key"
- Database already has data
- Either:
  1. Drop tables and re-run `npm run db:push`
  2. Or modify seed.ts to skip existing records

---

## 📞 Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Verify your DATABASE_URL in .env
3. Make sure Neon project is active
4. Try running commands again

---

## ✅ Verification Checklist

- [ ] Neon account created
- [ ] Project created in Neon
- [ ] Connection string copied
- [ ] .env file updated with DATABASE_URL
- [ ] `npm run db:push` executed successfully
- [ ] `npm run db:seed` completed without errors
- [ ] Can access Drizzle Studio (`npm run db:studio`)

---

## 🎉 You're All Set!

Your database is now configured and seeded with data. You can:
- View data in Drizzle Studio
- Manage users, roles, and tracks
- Scale infinitely with Neon's serverless PostgreSQL

**Ready to connect your app to the database? Let me know!**
