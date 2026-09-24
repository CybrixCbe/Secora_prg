import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  Lock,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getGoogleClientId, waitForGoogleScript } from '../lib/googleAuth';
import secoraLogo from '../assets/secora-logo.png';
import secoraFoliage from '../assets/secora-foliage.jpg';

interface LoginProps {
  initialStep?: string;
}

export default function Login(_props: LoginProps = {}) {
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const { 
    user: authUser, 
    loading: authLoading, 
    signInWithGoogle, 
    signInWithGithub, 
    loginWithGoogleIdToken 
  } = useAuth();

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (!authLoading && authUser) {
      navigate('/dashboard');
    }
  }, [authLoading, authUser, navigate]);

  // Initialize Google Identity Services (GIS) for optional One Tap
  useEffect(() => {
    let isMounted = true;

    async function initGIS() {
      const clientId = await getGoogleClientId();
      if (!clientId) return;

      const isReady = await waitForGoogleScript();
      if (!isReady || !isMounted || !window.google?.accounts?.id) return;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (response?.credential) {
              setGoogleLoading(true);
              setError('');
              setSuccess('Google account verified. Loading workstation...');
              try {
                await loginWithGoogleIdToken(response.credential);
                navigate('/dashboard');
              } catch (err: any) {
                console.error('[GIS] Login error:', err);
                setError(err.message || 'Google authentication failed.');
              } finally {
                setGoogleLoading(false);
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Prompt Google One Tap if browser has active Google session
        window.google.accounts.id.prompt();
      } catch (gisErr) {
        console.warn('[GIS] Initialization warning:', gisErr);
      }
    }

    initGIS();

    return () => {
      isMounted = false;
    };
  }, [loginWithGoogleIdToken, navigate]);

  // Google Sign-In Trigger
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    setSuccess('');
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.prompt();
      }
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('[Login] Google authentication failed:', err);
      setError(err.message || 'Failed to authenticate with Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // GitHub Sign-In Trigger
  const handleGithubSignIn = async () => {
    setGithubLoading(true);
    setError('');
    setSuccess('');
    try {
      await signInWithGithub();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('[Login] GitHub authentication failed:', err);
      setError(err.message || 'Failed to authenticate with GitHub.');
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#06100e] text-white font-body selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* LEFT COLUMN: Crisp Dark Emerald Botanical Panel */}
      <div className="hidden lg:relative lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-black select-none">
        
        {/* Background Image */}
        <img 
          src={secoraFoliage} 
          alt="SECORA Dark Emerald Foliage" 
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-105"
        />

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/50" />
        <div className="absolute inset-0 bg-[#002d28]/20 mix-blend-overlay" />

        {/* Top Header overlay */}
        <div className="relative z-10 p-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={secoraLogo} 
              alt="SECORA" 
              className="h-9 w-9 rounded-md object-cover shadow-md border border-white/20"
            />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-white tracking-[0.25em] text-sm group-hover:text-emerald-300 transition-colors">
                SECORA
              </span>
              <span className="font-mono text-[8px] text-white/60 tracking-widest uppercase">
                RECONNAISSANCE PLATFORM
              </span>
            </div>
          </Link>

          <div className="font-mono text-[9px] text-white/70 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>NODE // ACTIVE</span>
          </div>
        </div>

        {/* Bottom Editorial Content */}
        <div className="relative z-10 p-12 max-w-xl">
          <span className="font-mono text-[10px] text-emerald-400 tracking-[0.25em] uppercase font-bold block mb-3">
            [ ARCHITECTURAL INTELLIGENCE ]
          </span>
          <h2 className="font-heading text-3xl xl:text-4xl font-light text-white leading-tight">
            Look before you test. <br />
            <span className="font-medium text-emerald-400">Map the invisible perimeter.</span>
          </h2>
          <p className="text-xs text-white/70 mt-3 leading-relaxed max-w-md font-body">
            Passive attack surface intelligence, DNS zone record harvesting, and vulnerability diagnostics designed for security analysts and researchers.
          </p>

          <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between font-mono text-[9px] text-white/60">
            <span>SYS_ID: SEC-ART-648</span>
            <span>STANDARD: OWASP RECON v4</span>
            <span className="text-emerald-400">100% NON-INTRUSIVE</span>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Dedicated SSO Authentication Panel */}
      <div className="relative w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-y-auto">
        
        {/* Softly blurred background matching user reference */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-30 pointer-events-none"
          style={{ backgroundImage: `url(${secoraFoliage})` }}
        />
        {/* Dark frosted tint overlay */}
        <div className="absolute inset-0 bg-[#091513]/90 backdrop-blur-md pointer-events-none" />

        {/* Top Navigation Row */}
        <div className="relative z-10 flex items-center justify-between mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-emerald-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>BACK TO OVERVIEW</span>
          </Link>

          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400/80 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full">
            <Shield className="h-3 w-3 text-emerald-400" />
            <span>SSO FEDERATION</span>
          </div>
        </div>

        {/* Central Authentication Container */}
        <div className="relative z-10 max-w-md w-full mx-auto my-auto py-8">
          
          {/* Header Title & Subtext */}
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] text-emerald-400 tracking-[0.2em] uppercase font-bold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SECORA ACCESS CONTROL
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-semibold text-white tracking-tight">
              Workstation Access
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-2.5 font-body leading-relaxed">
              Select an authorized identity provider to authenticate your researcher session and launch the reconnaissance console.
            </p>
          </div>

          {/* Alert Banners */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-950/70 border border-red-500/40 text-red-200 text-xs rounded-md flex items-start gap-2.5 shadow-lg">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-6 p-3.5 bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs rounded-md flex items-start gap-2.5 shadow-lg">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
              <span className="leading-relaxed">{success}</span>
            </div>
          )}

          {/* SSO Authentication Action Stack */}
          <div className="space-y-4">
            
            {/* 1. Google Single Sign-On Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || githubLoading}
              className="w-full flex items-center justify-center gap-3.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-emerald-500/50 text-white py-3.5 px-4 rounded-md text-sm font-medium tracking-wide transition-all cursor-pointer disabled:opacity-50 group shadow-md"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* 2. GitHub Single Sign-On Button */}
            <button
              type="button"
              onClick={handleGithubSignIn}
              disabled={googleLoading || githubLoading}
              className="w-full flex items-center justify-center gap-3.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-emerald-500/50 text-white py-3.5 px-4 rounded-md text-sm font-medium tracking-wide transition-all cursor-pointer disabled:opacity-50 group shadow-md"
            >
              {githubLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                  <span>Connecting to GitHub...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>Continue with GitHub</span>
                </>
              )}
            </button>

          </div>

          {/* Security & Cryptographic Standard Notice */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono text-white/50 tracking-wider">
              <Lock className="h-3 w-3 text-emerald-400/80" />
              <span>ENTERPRISE OAUTH 2.0 & OIDC PROTOCOL</span>
            </div>
            <p className="text-[11px] text-white/40 mt-1.5 leading-relaxed font-body">
              Zero passwords or credentials are stored locally. Session tokens are encrypted in accordance with OWASP security guidelines.
            </p>
          </div>

        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-white/40 gap-2 border-t border-white/5">
          <span>SECORA INTELLIGENCE // WORKSTATION</span>
          <span>AUTHORIZED ANALYST ACCESS ONLY</span>
        </div>

      </div>

    </div>
  );
}
