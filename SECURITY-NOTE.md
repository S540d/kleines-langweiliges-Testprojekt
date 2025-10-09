# Security Note: Firebase Credentials

## Issue Fixed ✅

The Firebase credentials that were previously committed to the repository have been removed:

1. ✅ `firebase-config.js` is now in `.gitignore` and will not be committed
2. ✅ Real credentials have been replaced with placeholders
3. ✅ File removed from git tracking
4. ✅ Documentation updated with proper setup instructions

## ⚠️ Important: Rotate Your Firebase Credentials

**The old credentials from the git history are still exposed and should be rotated!**

### Steps to Secure Your Firebase Project:

1. **Regenerate/Rotate API Keys** (Recommended):
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `eisenhauer-matrix`
   - Go to Project Settings > General
   - In the "Your apps" section, delete the old Web App
   - Create a new Web App with a fresh API key
   - Update your local `firebase-config.js` with the new credentials

2. **Review Firestore Security Rules**:
   - Ensure only authenticated users can access their own data
   - Your current rules look good (users can only read/write their own tasks)

3. **Check Authorized Domains**:
   - Go to Authentication > Settings > Authorized domains
   - Ensure only your domains are listed (e.g., `s540d.github.io`, `localhost`)
   - Remove any suspicious domains

4. **Monitor Usage**:
   - Check Firebase Console > Usage tab
   - Look for any unusual spikes in reads/writes
   - Set up budget alerts if needed

## Why Firebase Web API Keys Are "Safe" to Expose

Firebase web API keys are **designed to be public** and included in client-side code. However:

- ✅ **Security is enforced by**:
  - Firestore Security Rules (users can only access their own data)
  - Authorized domains (only your domains can use the API)
  - Firebase Authentication (users must be logged in)

- ⚠️ **Still recommended to keep private**:
  - Prevents abuse/spam
  - Reduces quota consumption risk
  - Best practice for security hygiene

## Next Steps for New Users

Users setting up this project should:

1. Copy `firebase-config.example.js` to `firebase-config.js`
2. Create their own Firebase project
3. Add their own credentials to `firebase-config.js`
4. The file will remain private (not committed to git)

See [FIREBASE-SETUP.md](FIREBASE-SETUP.md) for detailed instructions.
