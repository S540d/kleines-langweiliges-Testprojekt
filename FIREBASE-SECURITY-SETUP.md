# 🔥 Firebase Security Setup Guide

## Quick Start

### 1. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit with your Firebase values
nano .env
```

Get your Firebase values from: **Firebase Console → Project Settings → General → Your apps**

### 2. Build Configuration

```bash
# Generate firebase-config.js from .env
npm run build
```

This creates `firebase-config.js` with your configuration and security documentation.

### 3. Deploy

Your `firebase-config.js` is now ready to deploy. The API keys in this file are **safe to commit** to Git.

---

## Firebase Console Security Setup

### Step 1: Configure Firestore Security Rules

1. Go to **Firebase Console → Firestore Database → Rules**
2. Replace default rules with production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data - users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null &&
                            request.auth.uid == userId;
    }

    // Tasks - users can only access their own tasks
    match /tasks/{taskId} {
      allow read, update, delete: if request.auth != null &&
                                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null &&
                       request.resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **Publish** to deploy rules
4. Test rules using the **Rules Simulator** tab

### Step 2: Configure Authorized Domains

1. Go to **Firebase Console → Authentication → Settings → Authorized domains**
2. Add your production domain:
   - ✅ `s540d.github.io` (or your custom domain)
   - ✅ `localhost` (for development)
3. Remove any unused domains

### Step 3: Configure Authentication Providers

1. Go to **Firebase Console → Authentication → Sign-in method**
2. Enable only the providers you use:
   - ✅ Google (if using Google Sign-In)
   - ✅ Apple (if using Apple Sign-In)
   - ✅ Anonymous (if using guest mode)
3. Configure OAuth consent screen for each provider

### Step 4: Enable Firebase App Check (Recommended)

1. Go to **Firebase Console → App Check**
2. Register your web app
3. Choose a provider:
   - **reCAPTCHA v3** (easiest for web apps)
   - **reCAPTCHA Enterprise** (more advanced)
4. Add the App Check SDK to your app (optional enhancement)

---

## Security Checklist

Before going live:

### Firebase Console
- [ ] Firestore Security Rules configured and tested
- [ ] Authorized domains list updated
- [ ] Only needed authentication providers enabled
- [ ] OAuth consent screen configured
- [ ] App Check enabled (recommended)

### Code
- [ ] `.env` file created with production values
- [ ] `npm run build` executed successfully
- [ ] `firebase-config.js` generated
- [ ] No server-side keys in client code

### Testing
- [ ] Test authentication flow
- [ ] Test Firestore read/write with security rules
- [ ] Test from production domain
- [ ] Test unauthorized access (should be blocked)

---

## Common Issues

### "Permission denied" errors

**Cause:** Security rules are blocking access

**Solution:**
1. Check Firebase Console → Firestore → Rules
2. Verify rules allow authenticated users to access their data
3. Test rules in Rules Simulator
4. Ensure user is properly authenticated

### Authentication not working on deployed site

**Cause:** Domain not in authorized list

**Solution:**
1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your production domain
3. Wait a few minutes for changes to propagate

### App Check blocking legitimate requests

**Cause:** App Check not configured for your deployment

**Solution:**
1. Register your deployment in Firebase Console → App Check
2. Add App Check SDK initialization to your app
3. Test thoroughly in development first

---

## Understanding Firebase Security

### What's Safe to Expose?

**✅ Safe to commit to Git:**
- Firebase web API keys (`apiKey`, `authDomain`, etc.)
- Project ID, App ID, Measurement ID
- Client-side configuration

**❌ Never commit:**
- `.env` file (optional - keys are public anyway, but best practice)
- Firebase Admin SDK keys (server-side)
- Service account JSON files
- Private API keys for other services

### Why Are Web API Keys Public?

Firebase web API keys are **client identifiers**, not secrets:

1. They identify your Firebase project
2. They route requests correctly
3. They're designed to be in client code
4. Security comes from **rules**, not hidden keys

**Real security layers:**
- 🛡️ Firestore Security Rules (who can access what data)
- 🛡️ Authorized Domains (which websites can use your project)
- 🛡️ App Check (additional bot/abuse protection)

### What About GitHub Scrapers?

Even if someone finds your Firebase config on GitHub:
- ❌ They can't access your data (Security Rules)
- ❌ They can't use it from unauthorized domains (Authorized Domains)
- ❌ They can't abuse your project (App Check)

**Your data is safe!**

---

## Need Help?

- 📖 [SECURITY.md](./SECURITY.md) - Full security documentation
- 🔥 [Firebase Security Rules](https://firebase.google.com/docs/rules)
- 🔐 [Firebase App Check](https://firebase.google.com/docs/app-check)
- 🔑 [Firebase API Keys Explained](https://firebase.google.com/docs/projects/api-keys)

---

**Remember:** Firebase web security = Rules + Domains + App Check, NOT hidden keys!
