#!/bin/bash

# Script to deploy Firestore rules
echo "🔥 Deploying Firestore rules..."

# Check if firebase CLI is available
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Deploy only firestore rules
firebase deploy --only firestore:rules --project bruno-e-julia

echo "✅ Firestore rules deployed!"
echo "ℹ️ The rules should now allow read/write operations."