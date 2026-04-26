const fs = require("fs");
const path = require("path");

let firestoreInstance;
let firebaseAdmin;

function getFirebaseAdmin() {
  if (firebaseAdmin !== undefined) {
    return firebaseAdmin;
  }

  try {
    firebaseAdmin = require("firebase-admin");
  } catch (error) {
    firebaseAdmin = null;
  }

  return firebaseAdmin;
}

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (error) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.");
    }
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    return JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  }

  return null;
}

function getFirestore() {
  if (firestoreInstance !== undefined) {
    return firestoreInstance;
  }

  const serviceAccount = loadServiceAccount();

  if (!serviceAccount) {
    firestoreInstance = null;
    return firestoreInstance;
  }

  const admin = getFirebaseAdmin();

  if (!admin) {
    throw new Error("firebase-admin is required when Firebase credentials are configured.");
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  firestoreInstance = admin.firestore();
  return firestoreInstance;
}

module.exports = {
  getFirestore
};
