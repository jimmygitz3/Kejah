# Why MongoDB Atlas Wasn't Working

## The Problem

When you tried to run the app with MongoDB Atlas, it failed with this error:
```
MongoAPIError: URI must include hostname, domain name, and tld
```

But when we tested with `node backend/test-mongodb.js`, it worked perfectly!

## Root Cause

The issue was **line breaks in the .env file**. When PowerShell or text editors save long lines, they sometimes add line breaks that break the MongoDB connection string.

### What Happened:
```env
# This is BROKEN (has line break in the middle):
MONGODB_URI=mongodb+srv://Kejah:K3j%40h@cluster0.obftxt9.mongodb.net/kejah?retryWrites=true&w=majority&appName=Clu
ster0

# MongoDB sees this as:
MONGODB_URI=mongodb+srv://Kejah:K3j%40h@cluster0.obftxt9.mongodb.net/kejah?retryWrites=true&w=majority&appName=Clu
# And "Cluster0" is on the next line, breaking the URI
```

## The Solution

### Option 1: Use Shorter URI (Recommended)

Remove the `&appName=Cluster0` parameter:

```env
MONGODB_URI=mongodb+srv://Kejah:K3j%40h@cluster0.obftxt9.mongodb.net/kejah?retryWrites=true&w=majority
```

This URI is shorter and won't wrap to a new line.

### Option 2: Use .env.atlas File

I've created `backend/.env.atlas` with the correct Atlas URI. To use it:

```bash
# Copy Atlas config to .env
copy backend\.env.atlas backend\.env

# Or on PowerShell
Copy-Item backend\.env.atlas backend\.env
```

## How to Switch Between Local and Atlas

### Use Local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/kejah
```

### Use MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://Kejah:K3j%40h@cluster0.obftxt9.mongodb.net/kejah?retryWrites=true&w=majority
```

## Testing MongoDB Atlas Connection

Before switching your app to Atlas, test the connection:

```bash
node backend/test-mongodb.js
```

You should see:
```
✅ SUCCESS! Connected to MongoDB Atlas
Database: kejah
Host: ac-dqqhdhj-shard-00-01.obftxt9.mongodb.net
```

## Important Notes

### 1. URL Encoding
Your password `K3j@h` has the `@` symbol encoded as `%40`:
- Original: `K3j@h`
- Encoded: `K3j%40h`

### 2. IP Whitelist
Make sure your IP is whitelisted in MongoDB Atlas:
1. Go to MongoDB Atlas Dashboard
2. Network Access → IP Access List  
3. Add `0.0.0.0/0` (allow all) for testing
4. Or add your specific IP address

### 3. Database Name
The database name `kejah` is specified in the URI. Collections will be created automatically.

## Current Setup

**File:** `backend/.env` (Local MongoDB)
```env
MONGODB_URI=mongodb://localhost:27017/kejah
```

**File:** `backend/.env.atlas` (MongoDB Atlas - Ready to use)
```env
MONGODB_URI=mongodb+srv://Kejah:K3j%40h@cluster0.obftxt9.mongodb.net/kejah?retryWrites=true&w=majority
```

## To Use MongoDB Atlas Now

1. **Stop the app** (if running)

2. **Copy Atlas config:**
   ```bash
   Copy-Item backend\.env.atlas backend\.env -Force
   ```

3. **Verify the connection:**
   ```bash
   node backend/test-mongodb.js
   ```

4. **Start the app:**
   ```bash
   npm start
   ```

5. **Check the console** - You should see:
   ```
   🚀 Kejah Server running on port 5000
   Connected to MongoDB
   ```

## Why It Works Now

✅ **No line breaks** - URI is on a single line  
✅ **Shorter URI** - Removed unnecessary `appName` parameter  
✅ **Proper encoding** - Password special characters encoded  
✅ **Explicit path** - server.js loads .env from correct location  

Your app can now work with both local MongoDB and MongoDB Atlas! 🎉

## Troubleshooting

### Still getting URI error?
- Check that .env file has NO line breaks in MONGODB_URI
- Open backend/.env in a text editor and ensure the URI is one continuous line

### Authentication failed?
- Verify username: `Kejah`
- Verify password: `K3j@h` (encoded as `K3j%40h`)
- Check user permissions in MongoDB Atlas

### Connection timeout?
- Check internet connection
- Verify IP whitelist in Atlas
- Try `0.0.0.0/0` to allow all IPs (for testing)

### Want to switch back to local?
```bash
# Edit backend/.env and change to:
MONGODB_URI=mongodb://localhost:27017/kejah
```
