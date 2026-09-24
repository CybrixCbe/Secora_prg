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
import { decodeGoogleIdToken, type GoogleIdTokenPayload } from '../lib/googleAuth';
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
  idToken?: string;
}

interface AuthContextType {
  user: SecoraUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isFirebaseReady: boolean;
  signInWithGoogle: () => Promise<SecoraUser>;
  loginWithGoogleIdToken: (idToken: string) => Promise<SecoraUser>;
  signOut: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<SecoraUser | null>>;
}

const STORAGE_KEY = 'secora_analyst_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SecoraUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore session on mount
  useEffect(() => {
    // 1. Check local session cache for persistent analyst identity (e.g. GIS session)
    try {
      const cached = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as SecoraUser;
        if (parsed && parsed.email) {
          setUser(parsed);
          setLoading(false);
        }
      }
    } catch (err) {
      console.warn('[AuthContext] Session restore note:', err);
    }

    // 2. Listen to Firebase Auth state if configured
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
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
          } catch {}

          // Best-effort session sync with backend
          try {
            const token = await currentFbUser.getIdToken();
            await api.googleAuth({
              credential: token,
              email: currentFbUser.email || '',
              name: currentFbUser.displayName || '',
              picture: currentFbUser.photoURL || '',
            });
          } catch {
            // Backend offline/static hosting (GitHub Pages)
          }
          setLoading(false);
        } else {
          setFirebaseUser(null);
          // If no Firebase user and no cached GIS user, verify server session
          const cached = localStorage.getItem(STORAGE_KEY);
          if (!cached) {
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
          } else {
            setLoading(false);
          }
        }
      });

      return () => unsubscribe();
    } else {
      // Firebase not active - verify if server session exists if no cached GIS session
      const cached = localStorage.getItem(STORAGE_KEY);
      if (!cached) {
        api.getSession()
          .then((session) => {
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
      } else {
        setLoading(false);
      }
    }
  }, []);

  /**
   * Directly establishes authenticated session using real Google ID Token from Google Identity Services (GIS).
   */
  const loginWithGoogleIdToken = async (idToken: string): Promise<SecoraUser> => {
    try {
      const payload: GoogleIdTokenPayload = decodeGoogleIdToken(idToken);
      const secoraUser: SecoraUser = {
        uid: payload.sub,
        email: payload.email,
        displayName: payload.name || payload.given_name || payload.email.split('@')[0],
        photoURL: payload.picture || null,
        username: payload.name || payload.email.split('@')[0],
        full_name: payload.name || '',
        role: 'Security Analyst',
        idToken,
      };

      // 1. Update state & storage
      setUser(secoraUser);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(secoraUser));
      } catch {}

      // 2. Best-effort sync with backend Express session
      try {
        await api.googleAuth({
          credential: idToken,
          email: payload.email,
          name: payload.name || '',
          picture: payload.picture || '',
        });
      } catch {
        // Backend offline / static GitHub Pages
      }

      // 3. Link with Firebase Auth if configured
      if (isFirebaseConfigured && auth) {
        try {
          const { GoogleAuthProvider, signInWithCredential } = await import('firebase/auth');
          const credential = GoogleAuthProvider.credential(idToken);
          const fbResult = await signInWithCredential(auth, credential);
          setFirebaseUser(fbResult.user);
        } catch (fbErr) {
          console.warn('[AuthContext] Firebase link note:', fbErr);
        }
      }

      return secoraUser;
    } catch (err: any) {
      console.error('[AuthContext] Error processing Google ID token:', err);
      throw new Error(err.message || 'Failed to authenticate with Google ID token.');
    }
  };

  /**
   * Popup-based sign in via Firebase Google Provider.
   */
  const signInWithGoogle = async (): Promise<SecoraUser> => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'Google authentication configuration missing. Please set VITE_GOOGLE_CLIENT_ID or VITE_FIREBASE_* in your environment.'
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
        secoraUser.idToken = idToken;
        await api.googleAuth({
          credential: idToken,
          email: fbUser.email || '',
          name: fbUser.displayName || '',
          picture: fbUser.photoURL || '',
        });
      } catch {
        // Backend offline / static GitHub Pages
      }

      setUser(secoraUser);
      setFirebaseUser(fbUser);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(secoraUser));
      } catch {}

      return secoraUser;
    } catch (error: any) {
      console.error('[AuthContext] Google sign-in failed:', error);
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
      console.warn('[AuthContext] Firebase signOut warning:', err);
    }

    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch {}

    try {
      await api.logout();
    } catch {}

    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}

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
        loginWithGoogleIdToken,
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
