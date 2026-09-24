import React, { useState, useEffect, useRef } from 'react';
import { Settings, Shield, Laptop, Database, KeyRound, AlertTriangle, CheckCircle, RefreshCw, User, Camera, Upload, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export default function SettingsPage() {
  const [defaultScanType, setDefaultScanType] = useState('Quick');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [theme, setTheme] = useState('light');
  const [sessionTimeout, setSessionTimeout] = useState('60 minutes');
  
  // Profile state
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [profileImage, setProfileImage] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSettingsAndProfile();
  }, []);

  const loadSettingsAndProfile = () => {
    Promise.all([
      api.getSettings().catch(() => ({ settings: {} })),
      api.getProfile().catch(() => ({}))
    ])
      .then(([settingsRes, profileRes]) => {
        const s = settingsRes.settings || {};
        setDefaultScanType(s.default_scan_type || 'Quick');
        setNotificationsEnabled(s.notifications_enabled === 1);
        setTheme(s.theme || 'light');

        if (profileRes) {
          setUsername(profileRes.username || '');
          setFullName(profileRes.full_name || '');
          setEmail(profileRes.email || '');
          setOrganization(profileRes.organization || '');
          setProfileImage(profileRes.profile_image || '');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Settings load error:", err);
        setMessage({ type: 'error', text: 'Failed to load system settings from server.' });
        setLoading(false);
      });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Profile image size must be under 2MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage(null);

    try {
      const res = await api.updateProfile({
        username: username.trim(),
        full_name: fullName.trim(),
        organization: organization.trim(),
        profile_image: profileImage,
      });
      if (res && res.status === 'success') {
        setUsername(res.username || username);
        setFullName(res.full_name || fullName);
        setOrganization(res.organization || organization);
        setProfileImage(res.profile_image || profileImage);
      }
      setMessage({ type: 'success', text: 'Researcher profile and avatar updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await api.saveSettings({
        default_scan_type: defaultScanType,
        notifications_enabled: notificationsEnabled ? 1 : 0,
        theme: theme,
      });
      setMessage({ type: 'success', text: 'Workstation preferences updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update preferences.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to restore default configuration settings?")) return;
    setSaving(true);
    try {
      await api.resetSettings();
      loadSettingsAndProfile();
      setMessage({ type: 'info', text: 'Platform preferences reset to defaults.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to reset settings.' });
      setSaving(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("WARNING: This will permanently delete your entire scan history. This action cannot be undone. Proceed?")) return;
    try {
      await api.clearHistory();
      setMessage({ type: 'error', text: 'All reconnaissance logs have been purged.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to purge scan logs.' });
    }
  };

  const handleExportSystemData = () => {
    window.open('/settings/export', '_blank');
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-3 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-8 py-12 flex flex-col gap-8 flex-grow">
      
      {/* Title Header */}
      <div className="flex flex-col gap-2 border-b border-border/30 pb-6">
        <span className="font-heading text-[10px] text-text-secondary tracking-[0.2em]">[ SECORA / SETTINGS / 06 ]</span>
        <h1 className="font-display-lg text-4xl text-text-primary tracking-tight font-light uppercase">
          SYSTEM SETTINGS.
        </h1>
        <p className="font-body text-sm text-text-secondary max-w-2xl leading-relaxed mt-2">
          Configure reconnaissance behavior, workspace preferences, and system data management.
        </p>
      </div>

      {message && (
        <div className={`p-4 text-xs rounded-xl font-semibold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
          message.type === 'info' ? 'bg-blue-50 border border-blue-200 text-blue-700' :
          'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' && <CheckCircle className="h-4 w-4 shrink-0" />}
          {message.type === 'error' && <AlertTriangle className="h-4 w-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Section 1: Researcher Profile & Avatar Card */}
      <div className="p-8 bg-surface-container-lowest border border-border rounded-[24px] shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-border/50 pb-4">
          <User className="h-5 w-5 text-text-primary" strokeWidth={1.5} />
          <h3 className="font-heading font-black text-xs text-text-primary uppercase tracking-widest">
            RESEARCHER IDENTITY & PROFILE PICTURE
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Avatar Section */}
          <div className="md:col-span-4 flex flex-col items-center justify-center gap-4 p-4 bg-surface-container-low rounded-[20px] border border-border/50">
            <div className="relative group">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={username || 'Profile'} 
                  className="w-24 h-24 rounded-full object-cover border-2 border-secondary shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-secondary text-white flex items-center justify-center text-2xl font-display-lg font-bold shadow-md">
                  {username ? username.substring(0, 2).toUpperCase() : 'SE'}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-text-primary text-surface rounded-full shadow-lg hover:bg-secondary transition-colors cursor-pointer"
                title="Upload Profile Picture"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest hover:bg-surface border border-border text-[9px] font-heading font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
              >
                <Upload className="h-3 w-3" />
                <span>Upload Picture</span>
              </button>
              {profileImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                  title="Remove Picture"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <span className="text-[9px] text-text-secondary">JPG, PNG, GIF up to 2MB</span>
          </div>

          {/* Profile Name & Details Form Fields */}
          <div className="md:col-span-8 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-heading font-bold text-text-secondary uppercase tracking-wider">
                  OPERATOR USERNAME
                </label>
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. CYBRIX_NK"
                  className="w-full px-5 py-3 bg-surface-container-low border border-border/80 text-xs text-text-primary font-body focus:border-secondary focus:outline-none rounded-full transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-heading font-bold text-text-secondary uppercase tracking-wider">
                  FULL DISPLAY NAME
                </label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Naveen Kumar"
                  className="w-full px-5 py-3 bg-surface-container-low border border-border/80 text-xs text-text-primary font-body focus:border-secondary focus:outline-none rounded-full transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-heading font-bold text-text-secondary uppercase tracking-wider">
                  EMAIL ADDRESS (READ-ONLY)
                </label>
                <input 
                  type="email" 
                  value={email}
                  disabled
                  className="w-full px-5 py-3 bg-surface-container-low/50 border border-border/40 text-xs text-text-secondary font-body rounded-full cursor-not-allowed opacity-75"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-heading font-bold text-text-secondary uppercase tracking-wider">
                  ORGANIZATION / AFFILIATION
                </label>
                <input 
                  type="text" 
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  placeholder="e.g. Cybrix Security Labs"
                  className="w-full px-5 py-3 bg-surface-container-low border border-border/80 text-xs text-text-primary font-body focus:border-secondary focus:outline-none rounded-full transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-8 py-3 bg-secondary hover:bg-secondary-hover text-white text-xs font-heading font-black tracking-widest rounded-full transition-all shadow-md shadow-secondary/20 cursor-pointer disabled:opacity-50"
              >
                {savingProfile ? "UPDATING PROFILE..." : "UPDATE PROFILE"}
              </button>
            </div>
          </div>

        </form>
      </div>

      {/* 2x2 Grid Form Container */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
        
        {/* Panel 1: Reconnaissance Configuration (Focused with teal outline & rounded-[24px]) */}
        <div className="p-8 bg-surface-container-lowest border-2 border-secondary/80 rounded-[24px] shadow-sm flex flex-col gap-6 relative">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <Shield className="h-5 w-5 text-text-primary" strokeWidth={1.5} />
            <h3 className="font-heading font-black text-xs text-text-primary uppercase tracking-widest">
              RECONNAISSANCE CONFIGURATION
            </h3>
          </div>

          <div className="space-y-4 flex-grow">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-heading font-bold text-text-secondary uppercase tracking-wider">
                DEFAULT SCAN PROFILE
              </label>
              <div className="relative">
                <select 
                  value={defaultScanType}
                  onChange={e => setDefaultScanType(e.target.value)}
                  className="w-full px-5 py-3.5 bg-surface-container-low border border-border/80 text-xs text-text-primary font-body focus:border-secondary focus:outline-none rounded-full appearance-none transition-colors"
                >
                  <option value="Quick">Quick Scan (Common TCP Ports)</option>
                  <option value="Full">Full Port Sweep (Aggressive)</option>
                  <option value="Passive">Passive Intel Only (DNS/WHOIS)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-text-secondary text-xs">
                  ▼
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low rounded-[16px] border border-border/60 text-[11px] text-text-secondary leading-relaxed">
              Configuration profile handles scanning parameters, port sweep depths, and TLS analytics protocols.
            </div>
          </div>
        </div>

        {/* Panel 2: Workspace Preferences (rounded-[24px]) */}
        <div className="p-8 bg-surface-container-lowest border border-border rounded-[24px] shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <Laptop className="h-5 w-5 text-text-primary" strokeWidth={1.5} />
            <h3 className="font-heading font-black text-xs text-text-primary uppercase tracking-widest">
              WORKSPACE PREFERENCES
            </h3>
          </div>

          <div className="space-y-6 flex-grow">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-heading font-bold text-text-secondary uppercase tracking-wider">
                UI COLOR THEME
              </label>
              <div className="relative">
                <select 
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  className="w-full px-5 py-3.5 bg-surface-container-low border border-border/80 text-xs text-text-primary font-body focus:border-secondary focus:outline-none rounded-full appearance-none transition-colors"
                >
                  <option value="light">Holographic Dark Terminal</option>
                  <option value="dark">SECORA Premium Light Canvas</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-text-secondary text-xs">
                  ▼
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-heading font-bold text-text-primary uppercase tracking-wider">
                  NOTIFICATIONS AND ALERTS
                </span>
                <span className="text-[10px] text-text-secondary">Flash desktop status banner when scans finish.</span>
              </div>
              <input 
                type="checkbox" 
                checked={notificationsEnabled}
                onChange={e => setNotificationsEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded bg-white border-border cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Panel 3: Data Management (rounded-[24px]) */}
        <div className="p-8 bg-surface-container-lowest border border-border rounded-[24px] shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <Database className="h-5 w-5 text-text-primary" strokeWidth={1.5} />
            <h3 className="font-heading font-black text-xs text-text-primary uppercase tracking-widest">
              DATA MANAGEMENT
            </h3>
          </div>

          <div className="space-y-6 flex-grow">
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Export history scan metrics from the system or purge database tables.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                type="button"
                onClick={handleExportSystemData}
                className="px-6 py-3 bg-surface-container-lowest hover:bg-surface-container-low border border-border text-[10px] text-text-primary font-heading font-bold tracking-wider rounded-full transition-colors shadow-sm cursor-pointer"
              >
                EXPORT SYSTEM DATA
              </button>
              <button 
                type="button"
                onClick={handleClearHistory}
                className="px-6 py-3 bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-[10px] text-red-300 font-heading font-bold tracking-wider rounded-full transition-colors cursor-pointer"
              >
                PURGE SCAN HISTORY
              </button>
            </div>
          </div>
        </div>

        {/* Panel 4: Security Configuration (rounded-[24px]) */}
        <div className="p-8 bg-surface-container-lowest border border-border rounded-[24px] shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <KeyRound className="h-5 w-5 text-text-primary" strokeWidth={1.5} />
            <h3 className="font-heading font-black text-xs text-text-primary uppercase tracking-widest">
              SECURITY CONFIGURATION
            </h3>
          </div>

          <div className="space-y-4 flex-grow">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-heading font-bold text-text-secondary uppercase tracking-wider">
                ACTIVE SESSION TIMEOUT LIMIT
              </label>
              <div className="relative">
                <select 
                  value={sessionTimeout}
                  onChange={e => setSessionTimeout(e.target.value)}
                  className="w-full px-5 py-3.5 bg-surface-container-low border border-border/80 text-xs text-text-primary font-body focus:border-secondary focus:outline-none rounded-full appearance-none transition-colors"
                >
                  <option value="30 minutes" className="bg-[#0a1714] text-white">30 minutes</option>
                  <option value="60 minutes" className="bg-[#0a1714] text-white">60 minutes</option>
                  <option value="12 hours" className="bg-[#0a1714] text-white">12 hours</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-text-secondary text-xs">
                  ▼
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Action buttons */}
        <div className="lg:col-span-2 pt-4 flex items-center gap-4 justify-end">
          <button 
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 bg-surface-container-lowest hover:bg-surface-container-low text-text-primary border border-border text-xs font-heading font-black tracking-widest rounded-full transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>RESET DEFAULTS</span>
          </button>
          <button 
            type="submit"
            disabled={saving}
            className="px-10 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-heading font-black tracking-widest rounded-full transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE CONFIGURATION"}
          </button>
        </div>

      </form>
    </div>
  );
}
