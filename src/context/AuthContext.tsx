import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  isFirebaseConfigured,
  mapFirebaseAuthError,
  type FirebaseUser,
} from '../lib/firebase';
import { api } from '../services/api';

export interface SecoraUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  username: string;
  role: string;
  full_name?: string;
  organization?: string;
}

interface AuthContextType {
  user: SecoraUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isFirebaseReady: boolean;
  signInWithGoogle: () => Promise<SecoraUser>;
  signOut: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<SecoraUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SecoraUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // If Firebase is configured and auth initialized, listen to persistent state
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (currentFbUser) => {
        if (currentFbUser) {
          const profile: SecoraUser = {
            uid: currentFbUser.uid,
            email: currentFbUser.email,
            displayName: currentFbUser.displayName,
            photoURL: currentFbUser.photoURL,
            username: currentFbUser.displayName || currentFbUser.email?.split('@')[0] || 'Analyst',
            full_name: currentFbUser.displayName || '',
            role: 'Security Analyst',
          };
          setFirebaseUser(currentFbUser);
          setUser(profile);

          // Best-effort session sync with backend if running
          try {
            const token = await currentFbUser.getIdToken();
            await api.googleAuth({
              credential: token,
              email: currentFbUser.email || '',
              name: currentFbUser.displayName || '',
              picture: currentFbUser.photoURL || '',
            });
          } catch {
            // Backend offline/static hosting (GitHub Pages) - client Firebase session remains valid
          }
          setLoading(false);
        } else {
          setFirebaseUser(null);
          // Check if there is an active local/server cookie session (e.g. analyst credentials)
          try {
            const session = await api.getSession();
            if (session && session.authenticated) {
              setUser({
                uid: `local-${session.username}`,
                email: session.email || null,
                displayName: session.full_name || session.username,
                photoURL: session.profile_image || null,
                username: session.username,
                full_name: session.full_name || session.username,
                role: session.role || 'Analyst',
              });
            } else {
              setUser(null);
            }
          } catch {
            setUser(null);
          } finally {
            setLoading(false);
          }
        }
      });

      return () => unsubscribe();
    } else {
      // Firebase not configured yet - check backend session if available
      api.getSession()
        .then(session => {
          if (session && session.authenticated) {
            setUser({
              uid: `local-${session.username}`,
              email: session.email || null,
              displayName: session.full_name || session.username,
              photoURL: session.profile_image || null,
              username: session.username,
              full_name: session.full_name || session.username,
              role: session.role || 'Analyst',
            });
          } else {
            setUser(null);
          }
        })
        .catch(() => {
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const signInWithGoogle = async (): Promise<SecoraUser> => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        "Firebase is not configured. Please set the VITE_FIREBASE_* environment variables in your environment."
      );
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const secoraUser: SecoraUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        username: fbUser.displayName || fbUser.email?.split('@')[0] || 'Analyst',
        full_name: fbUser.displayName || '',
        role: 'Security Analyst',
      };

      try {
        const idToken = await fbUser.getIdToken();
        await api.googleAuth({
          credential: idToken,
          email: fbUser.email || '',
          name: fbUser.displayName || '',
          picture: fbUser.photoURL || '',
        });
      } catch {
        // Backend offline/static hosting - client-side session remains valid
      }

      setUser(secoraUser);
      setFirebaseUser(fbUser);
      return secoraUser;
    } catch (error: any) {
      console.error("[AuthContext] Google sign-in failed:", error);
      const friendlyMessage = mapFirebaseAuthError(error);
      throw new Error(friendlyMessage);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
    } catch (err) {
      console.warn("[AuthContext] Firebase signOut warning:", err);
    }

    try {
      await api.logout();
    } catch {
      // Backend offline
    }

    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isFirebaseReady: isFirebaseConfigured,
        signInWithGoogle,
        signOut,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
