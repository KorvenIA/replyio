'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from "@/lib/supabase";

export default function Settings() {
  const supabase = createClient();
  const router = useRouter();

  const [academyName, setAcademyName] = useState('Academy Name');
  const [supportEmail, setSupportEmail] = useState('admin@academy.com');
  const [websiteUrl, setWebsiteUrl] = useState('https://academy.com');
  const [savedAcademyName, setSavedAcademyName] = useState('Academy Name');
  const [savedSupportEmail, setSavedSupportEmail] = useState('admin@academy.com');

  const [isProfileSaving, setIsProfileSaving] = useState(false);

  const [aiProvider, setAiProvider] = useState<'Groq' | 'Gemini'>('Groq');
  const [apiKey, setApiKey] = useState('gsk_y7u3n2b8f8w90q1a2s3d4f5g6h7j8k9l');
  const [showApiKey, setShowApiKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'Connected' | 'Not configured'>('Connected');
  
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isAISaving, setIsAISaving] = useState(false);

  const widgetCode = `<script src="https://replyio.app/widget.js" data-key="YOUR_KEY"></script>`;
  const [isCopied, setIsCopied] = useState(false);

  const [dangerModal, setDangerModal] = useState<'reset' | 'delete' | null>(null);
  const [dangerConfirmText, setDangerConfirmText] = useState('');
  const [isDangerActionRunning, setIsDangerActionRunning] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    getUser();
  }, []);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!academyName.trim() || !supportEmail.trim()) return;

    setIsProfileSaving(true);
    setTimeout(() => {
      setIsProfileSaving(false);
      setSavedAcademyName(academyName.trim());
      setSavedSupportEmail(supportEmail.trim());
      triggerToast('Academy profile updated successfully!');
    }, 600);
  };

  const handleTestConnection = () => {
    if (!apiKey.trim()) {
      setConnectionStatus('Not configured');
      triggerToast('Please provide an API Key first.', 'error');
      return;
    }

    setIsTestingConnection(true);
    setTimeout(() => {
      setIsTestingConnection(false);
      setConnectionStatus('Connected');
      triggerToast('AI Service connected successfully!');
    }, 800);
  };

  const handleSaveAIConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAISaving(true);
    setTimeout(() => {
      setIsAISaving(false);
      if (apiKey.trim()) {
        setConnectionStatus('Connected');
        triggerToast('AI Configuration saved successfully!');
      } else {
        setConnectionStatus('Not configured');
        triggerToast('AI credentials cleared.', 'info');
      }
    }, 600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(widgetCode);
    setIsCopied(true);
    triggerToast('Embed code copied to clipboard!', 'success');
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleDangerAction = () => {
    if (dangerConfirmText.trim().toLowerCase() !== savedAcademyName.toLowerCase()) {
      triggerToast('Confirmation text does not match.', 'error');
      return;
    }

    setIsDangerActionRunning(true);
    setTimeout(() => {
      setIsDangerActionRunning(false);
      if (dangerModal === 'reset') {
        setAcademyName('Academy Name');
        setSupportEmail('admin@academy.com');
        setWebsiteUrl('https://academy.com');
        setSavedAcademyName('Academy Name');
        setSavedSupportEmail('admin@academy.com');
        setAiProvider('Groq');
        setApiKey('gsk_y7u3n2b8f8w90q1a2s3d4f5g6h7j8k9l');
        setConnectionStatus('Connected');
        setDangerModal(null);
        setDangerConfirmText('');
        triggerToast('All settings reset to defaults!', 'info');
      } else if (dangerModal === 'delete') {
        setDangerModal(null);
        triggerToast('Academy deleted. Redirecting you home...', 'info');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    }, 1200);
  };

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
            <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-[#EFF6FF] text-[#2563EB] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </div>
        </nav>
        {/* User Profile */}
        <div className="px-5 py-4 border-t border-[#E5E5E5] flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 border border-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-700">
            {userEmail ? userEmail.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{userEmail || "Loading..."}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        
        {/* Top Bar */}
        <div className="bg-white border-b border-[#E5E5E5] px-8 py-5 flex justify-between items-center flex-shrink-0">
          <h1 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Settings</h1>
        </div>

        {/* Form Container */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 max-w-2xl w-full">
          
          {/* Section 1: Academy Profile */}
          <div className="bg-white border border-[#E5E5E5] rounded-lg p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Academy Profile</h2>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Academy Name</label>
                  <input
                    type="text"
                    required
                    value={academyName}
                    onChange={(e) => setAcademyName(e.target.value)}
                    className="px-3 py-2 border border-[#E5E5E5] rounded-md text-xs text-gray-800 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Support Email</label>
                  <input
                    type="email"
                    required
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="px-3 py-2 border border-[#E5E5E5] rounded-md text-xs text-gray-800 focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Website URL</label>
                <input
                  type="url"
                  required
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-xs text-gray-800 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isProfileSaving}
                  className="px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-md text-xs font-medium transition-colors cursor-pointer"
                >
                  {isProfileSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: AI Configuration */}
          <div className="bg-white border border-[#E5E5E5] rounded-lg p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">AI Configuration</h2>

            <form onSubmit={handleSaveAIConfig} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">AI Provider</label>
                  <select
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value as any)}
                    className="w-full px-2.5 py-2 border border-[#E5E5E5] bg-white rounded-md text-xs text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Groq">Groq</option>
                    <option value="Gemini">Gemini</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">API Key</label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-xs text-gray-800 focus:outline-none focus:border-gray-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="px-3.5 py-1.5 border border-[#E5E5E5] text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                >
                  {isTestingConnection ? 'Testing...' : 'Test Connection'}
                </button>
                <button
                  type="submit"
                  disabled={isAISaving}
                  className="px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-md text-xs font-medium transition-colors cursor-pointer"
                >
                  {isAISaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>

          {/* Section 3: Chat Widget */}
          <div className="bg-white border border-[#E5E5E5] rounded-lg p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Chat Widget</h2>
            
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  readOnly
                  value={widgetCode}
                  className="w-full p-3 bg-[#F7F7F7] border border-[#E5E5E5] text-gray-700 rounded-md text-xs font-mono resize-none focus:outline-none"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`absolute top-2 right-2 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    isCopied ? 'bg-green-600 text-white' : 'bg-white border border-[#E5E5E5] text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Paste this code inside your site's body tag to activate the widget.
              </p>
            </div>
          </div>

          {/* Section 4: Danger Zone */}
          <div className="bg-red-50/50 border border-red-200 rounded-lg p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-4">Danger Zone</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setDangerModal('reset')}
                className="flex-1 py-2 bg-white hover:bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                Reset all data
              </button>
              <button
                type="button"
                onClick={() => setDangerModal('delete')}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                Delete Academy
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {dangerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => {
              if (!isDangerActionRunning) {
                setDangerModal(null);
                setDangerConfirmText('');
              }
            }}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-xxs transition-opacity"
          />

          <div className="relative w-full max-w-sm bg-white border border-[#E5E5E5] rounded-lg shadow-lg flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E5E5] bg-[#F7F7F7] flex items-center justify-between text-red-600">
              <h3 className="text-xs font-bold">
                {dangerModal === 'reset' ? 'Reset All Data' : 'Delete Academy'}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                This action is permanent and cannot be undone. Enter <span className="font-semibold text-gray-900">"{savedAcademyName}"</span> to confirm.
              </p>

              <input
                type="text"
                disabled={isDangerActionRunning}
                value={dangerConfirmText}
                onChange={(e) => setDangerConfirmText(e.target.value)}
                placeholder="Confirm name"
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-xs text-gray-800 focus:outline-none focus:border-gray-400"
              />
            </div>

            <div className="px-6 py-3 bg-[#F7F7F7] border-t border-[#E5E5E5] flex gap-3 justify-end">
              <button
                type="button"
                disabled={isDangerActionRunning}
                onClick={() => {
                  setDangerModal(null);
                  setDangerConfirmText('');
                }}
                className="px-3 py-1.5 bg-white border border-[#E5E5E5] text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDangerAction}
                disabled={isDangerActionRunning || dangerConfirmText.trim().toLowerCase() !== savedAcademyName.toLowerCase()}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md cursor-pointer disabled:opacity-50"
              >
                {isDangerActionRunning ? 'Executing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-4 py-3 rounded-lg border border-gray-800 shadow-lg text-xs flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
