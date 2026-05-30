'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

interface CompanySettings {
  id?: string;
  company_name: string;
  website_url: string;
  support_email: string;
  logo_url: string;
  twitter_url: string;
  linkedin_url: string;
  facebook_url: string;
  instagram_url: string;
}

const emptySettings: CompanySettings = {
  company_name: '',
  website_url: '',
  support_email: '',
  logo_url: '',
  twitter_url: '',
  linkedin_url: '',
  facebook_url: '',
  instagram_url: '',
};

export default function CompanySettings() {
  const supabase = createClient();
  const [settings, setSettings] = useState<CompanySettings>(emptySettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .single();

      if (data && !error) {
        setSettings(data);
      }
      setIsLoading(false);
    };
    loadSettings();
  }, [supabase]);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleChange = (field: keyof CompanySettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let error;
      if (settings.id) {
        // Update existing row
        const { error: updateError } = await supabase
          .from('company_settings')
          .update({
            company_name: settings.company_name,
            website_url: settings.website_url,
            support_email: settings.support_email,
            logo_url: settings.logo_url,
            twitter_url: settings.twitter_url,
            linkedin_url: settings.linkedin_url,
            facebook_url: settings.facebook_url,
            instagram_url: settings.instagram_url,
          })
          .eq('id', settings.id);
        error = updateError;
      } else {
        // Insert new row
        const { data, error: insertError } = await supabase
          .from('company_settings')
          .insert({
            company_name: settings.company_name,
            website_url: settings.website_url,
            support_email: settings.support_email,
            logo_url: settings.logo_url,
            twitter_url: settings.twitter_url,
            linkedin_url: settings.linkedin_url,
            facebook_url: settings.facebook_url,
            instagram_url: settings.instagram_url,
          })
          .select()
          .single();
        error = insertError;
        if (data) setSettings(data);
      }

      if (error) {
        triggerToast('Failed to save settings.', 'error');
      } else {
        triggerToast('Company settings saved successfully!');
      }
    } catch {
      triggerToast('An unexpected error occurred.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = 'w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-xs text-gray-800 focus:outline-none focus:border-gray-400 bg-white placeholder:text-gray-300 transition-colors';
  const labelClass = 'text-[10px] font-semibold uppercase tracking-wider text-gray-500';

  return (
    <div className="flex h-screen bg-[#FFFFFF] text-[#1A1A1A] font-sans antialiased overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-[#F7F7F7] border-r border-[#E5E5E5] flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[#E5E5E5]">
          <span className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Replyio</span>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              Dashboard
            </Link>
            <Link href="/dashboard/analytics" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Analytics
            </Link>
            <Link href="/dashboard/tickets" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Tickets
            </Link>
            <Link href="/dashboard/knowledge" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.001c0 1.295.38 2.531 1.01 3.585L12 18l8.99 2.585c.63-1.054 1.01-2.29 1.01-3.585 0-6.003-4.5-10.748-10-10.748z" />
              </svg>
              Knowledge Base
            </Link>

            {/* Settings group */}
            <div className="pt-3 pb-1">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Settings</p>
            </div>
            <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              General
            </Link>
            <Link href="/dashboard/company-settings" className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-[#EFF6FF] text-[#2563EB] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Company
            </Link>
          </div>
        </nav>
        {/* User Profile */}
        <div className="px-5 py-4 border-t border-[#E5E5E5] flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 border border-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-700">
            {userEmail ? userEmail.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{userEmail || 'Loading...'}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top Bar */}
        <div className="bg-white border-b border-[#E5E5E5] px-8 py-5 flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Company Settings</h1>
            <p className="text-xs text-gray-400 mt-0.5">Configure your company profile and social links</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 overflow-y-auto px-8 py-8 max-w-2xl w-full">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading settings...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">

              {/* Section: Company Identity */}
              <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Company Identity</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Company Name</label>
                    <input
                      type="text"
                      value={settings.company_name}
                      onChange={handleChange('company_name')}
                      placeholder="Acme Inc."
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Support Email</label>
                    <input
                      type="email"
                      value={settings.support_email}
                      onChange={handleChange('support_email')}
                      placeholder="support@acme.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Website URL</label>
                  <input
                    type="url"
                    value={settings.website_url}
                    onChange={handleChange('website_url')}
                    placeholder="https://acme.com"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Logo URL</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="url"
                      value={settings.logo_url}
                      onChange={handleChange('logo_url')}
                      placeholder="https://acme.com/logo.png"
                      className={inputClass}
                    />
                    {settings.logo_url && (
                      <img
                        src={settings.logo_url}
                        alt="Logo preview"
                        className="w-9 h-9 rounded border border-[#E5E5E5] object-contain flex-shrink-0 bg-gray-50"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">Paste a publicly accessible image URL</p>
                </div>
              </div>

              {/* Section: Social Media */}
              <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Social Media</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Twitter */}
                  <div className="flex flex-col gap-1">
                    <label className={labelClass + ' flex items-center gap-1.5'}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Twitter / X
                    </label>
                    <input
                      type="url"
                      value={settings.twitter_url}
                      onChange={handleChange('twitter_url')}
                      placeholder="https://x.com/acme"
                      className={inputClass}
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="flex flex-col gap-1">
                    <label className={labelClass + ' flex items-center gap-1.5'}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={settings.linkedin_url}
                      onChange={handleChange('linkedin_url')}
                      placeholder="https://linkedin.com/company/acme"
                      className={inputClass}
                    />
                  </div>

                  {/* Facebook */}
                  <div className="flex flex-col gap-1">
                    <label className={labelClass + ' flex items-center gap-1.5'}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={settings.facebook_url}
                      onChange={handleChange('facebook_url')}
                      placeholder="https://facebook.com/acme"
                      className={inputClass}
                    />
                  </div>

                  {/* Instagram */}
                  <div className="flex flex-col gap-1">
                    <label className={labelClass + ' flex items-center gap-1.5'}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={settings.instagram_url}
                      onChange={handleChange('instagram_url')}
                      placeholder="https://instagram.com/acme"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-4 py-3 rounded-lg border border-gray-800 shadow-lg text-xs flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full animate-pulse ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
