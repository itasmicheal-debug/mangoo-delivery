# Firebase Integration Guide

## Overview

Your Mangoo Delivery app now includes:
- ✅ **Firestore Real-time Sync** — Settings auto-sync across tabs/devices
- ✅ **Firebase Authentication** — Email/password admin login
- ✅ **Admin Dashboard** — Protected edit panel for pricing and contact info
- ✅ **Local Storage Fallback** — Works offline, syncs when online

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Project Setup

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (use "my-laundry-8089b" or any name)
3. Enable Firestore and Authentication

#### Enable Firestore Database
1. In Firebase Console → Firestore Database
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select your region
5. Click **"Create"**

#### Enable Authentication
1. In Firebase Console → Authentication
2. Click **"Get started"**
3. Click **"Email/Password"**
4. Enable **"Email/Password"**
5. Create admin users:
   - Click **"Add user"**
   - Enter email: `admin@example.com`
   - Enter password: `strong-password-here`

#### Set Firestore Security Rules
1. Go to Firestore → **Rules** tab
2. Replace with:
```javascript
rules_version = '3';
service cloud.firestore {
  match /databases/{database}/documents {
    match /site/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
3. Click **"Publish"**

### 3. Start Development Server
```bash
npm start
```

## Using the Admin Dashboard

### Access Admin
- Navigate to `http://localhost:3000/admin`
- Login with your Firebase credentials (`admin@example.com` / `password`)

### Edit Settings
1. **Contact & WhatsApp**
   - Phone display
   - Phone for calls (format: +2349038353163)
   - WhatsApp number (digits only)
   - Email for bookings
   - WhatsApp pre-filled message
   - Footer address

2. **Pricing Plans** (3 cards)
   - Edit plan names, prices, features
   - Mark one as "Featured" (shows "Popular" badge)

3. **Price List**
   - Quick reference pricing table
   - Add/remove rows as needed

### Save & Sync
- Click **"Save changes"** to sync to Firestore
- Changes appear in real-time across all tabs/devices
- Offline edits sync automatically when back online

## Real-time Sync Features

### How It Works
1. **Admin edits settings** → Saved to Firestore
2. **Firestore updates** → Realtime listener triggers
3. **All tabs/devices** → See changes instantly

### Fallback Strategy
- If Firestore is unavailable, edits save to `localStorage`
- When Firestore becomes available, changes sync automatically
- Both local and remote stay in sync

## Architecture

### Files Created
- `src/firebase.js` — Firebase initialization & exports
- `src/hooks/useAuth.js` — Firebase auth state hook
- `src/hooks/useFirestoreDoc.js` — Real-time Firestore listener hook
- `src/pages/admin/ProtectedAdminPage.jsx` — Firebase auth wrapper
- `src/pages/admin/AdminPageContent.jsx` — Admin form UI
- `src/pages/admin/firebaseAdminAuth.js` — Sign in/out utilities

### Modified Files
- `src/App.js` — Added `/admin` protected route
- `src/settings/SiteSettingsContext.jsx` — Integrated Firestore real-time sync
- `package.json` — Added Firebase dependency

## Troubleshooting

### "Permission denied" Error
- Check Firestore Rules (should allow authenticated users)
- Verify user is logged in with Firebase credentials

### Settings Not Syncing
- Check browser console for errors
- Verify Firestore database is active
- Ensure user has read/write permissions

### Offline Mode
- App continues working with cached settings
- Changes save to `localStorage`
- Syncs to Firestore when online

## Next Steps (Optional)

- Add more admin users
- Implement role-based access (admin, manager, viewer)
- Add audit logs for setting changes
- Set up custom domain with Firebase Hosting
- Add email verification for admin accounts

## Security Notes

⚠️ **Development Mode:** Current Firestore rules are open to authenticated users. For production:
1. Restrict write access to admin users only
2. Implement proper role-based access control
3. Add audit logging
4. Enable Application Protection in Firebase Console

## Testing Checklist

- [ ] Deploy to Firebase Hosting
- [ ] Test admin login
- [ ] Edit settings and verify save
- [ ] Open admin in 2 tabs, edit in one, see update in other
- [ ] Go offline, edit, go online, verify sync
- [ ] Create additional admin users
- [ ] Test logout functionality
