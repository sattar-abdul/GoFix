# GoFix Workflow Test Guide

## Step-by-Step Testing Instructions

### 1. Create a Task (as User)
1. Login as a **user** (register if needed)
2. Go to **"Post a Service Request"**
3. Fill out:
   - Title: "Fix my sink"
   - Description: "My kitchen sink is leaking"
   - Category: "Plumbing"
4. Submit the task
5. Go to **"My Job Requests"** - you should see your task

### 2. Place a Bid (as Provider)
1. Login as a **provider** (register if needed)
2. Go to **"Browse Jobs"** - you should see the task
3. Click **"Place Bid"**
4. Enter:
   - Cost: 100
   - Time: 2 (days)
5. Go to **"My Bids"** - you should see your bid

### 3. Select Provider (as User)
1. Go back to **"My Job Requests"** as the user
2. Click **"View Bids"** on your task
3. Click **"Select"** on the provider's bid
4. Check console logs for debugging info

### 4. Check Accepted Work (as Provider)
1. Go to **"Accepted Work"** as the provider
2. You should see the assigned task
3. Check console logs for debugging info

### 5. Complete Task (as Provider)
1. Click **"Mark as Completed"** on the task
2. Confirm the completion

### 6. Rate Provider (as User)
1. Go to **"My Job Requests"** as the user
2. You should see a **"Rate Provider"** button
3. Click it and submit a rating

### 7. Test Chat
1. Go to **"Chat"** from the navigation
2. Enter the task ID
3. Send messages

## Debugging
- Check browser console for logs
- Check backend terminal for logs
- Verify user IDs are being stored correctly
