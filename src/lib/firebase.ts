import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "your_firebase_api_key_here" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "your_project_id"
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error("[Firebase] Initialization error:", error);
  }
}

export { app, auth, googleProvider, firebaseSignOut, signInWithPopup, onAuthStateChanged };
export type { FirebaseUser };

/**
 * Maps Firebase auth error codes to clean, human-readable user messages.
 */
export function mapFirebaseAuthError(error: any): string {
  if (!error) return "An unknown authentication error occurred.";
  const code = error.code || "";

  switch (code) {
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Google sign-in popup was blocked by your browser. Please allow popups for this site.";
    case "auth/unauthorized-domain":
      return "Unauthorized domain. Please add this domain to Firebase Console -> Authentication -> Settings -> Authorized domains.";
    case "auth/invalid-api-key":
      return "Invalid Firebase API key. Please check your VITE_FIREBASE_API_KEY configuration.";
    case "auth/network-request-failed":
      return "Network connection failed. Please check your internet connectivity.";
    case "auth/cancelled-popup-request":
      return "Sign-in request was cancelled.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email using a different sign-in method.";
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled in Firebase Console. Enable it under Authentication -> Sign-in method -> Google.";
    case "auth/user-disabled":
      return "This account has been disabled by an administrator.";
    case "auth/configuration-missing":
      return "Firebase configuration is missing. Please set VITE_FIREBASE_* environment variables.";
    default:
      return error.message || "Google sign-in failed. Please try again.";
  }
}
