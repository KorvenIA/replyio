'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from "@/lib/supabase";

interface DocumentFile {
  id: string;
  name: string;
  file_type: string;
  file_size: string;
  uploaded_at: string;
  content: string;
}

export default function KnowledgeBase() {
  const supabase = createClient();
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [lastUpdated, setLastUpdated] = useState('Today');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeViewDoc, setActiveViewDoc] = useState<DocumentFile | null>(null);

  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
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

  const fetchDocuments = useCallback(async () => {
    const { data, error } = await supabase.from('documents').select('*').order('uploaded_at', { ascending: false });
    if (data) {
      setDocuments(data);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDeleteDoc = async (id: string, name: string) => {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) {
      alert('Error deleting document');
      return;
    }
    setDocuments(documents.filter((doc) => doc.id !== id));
    setToastMessage(`"${name}" deleted successfully.`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const response = await fetch('/api/knowledge', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (response.ok && data.document) {
        await fetchDocuments();
        setLastUpdated('Just now');
        setIsUploadOpen(false);
        setFileToUpload(null);
        setToastMessage(`"${data.document.name}" uploaded and trained successfully.`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
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
            <Link href="/dashboard/knowledge" className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-[#EFF6FF] text-[#2563EB] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.001c0 1.295.38 2.531 1.01 3.585L12 18l8.99 2.585c.63-1.054 1.01-2.29 1.01-3.585 0-6.003-4.5-10.748-10-10.748z" />
              </svg>
              Knowledge Base
            </Link>

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
            <Link href="/dashboard/company-settings" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A] text-sm font-medium transition-colors">
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
          <h1 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Knowledge Base</h1>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-sm cursor-pointer"
          >
            + Upload Document
          </button>
        </div>

        {/* Workspace Container */}
        <div className="flex-1 overflow-y-auto px-8 py-8 flex flex-col gap-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-shrink-0">
            <div className="bg-white rounded-lg border border-[#E5E5E5] p-5">
              <p className="text-xs font-medium text-gray-500 mb-1">Documents</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold tracking-tight text-[#1A1A1A]">{documents.length}</span>
                <span className="text-[10px] text-gray-400 font-normal">Total trained</span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E5E5] p-5">
              <p className="text-xs font-medium text-gray-500 mb-1">Last Updated</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold tracking-tight text-[#1A1A1A]">{lastUpdated}</span>
                <span className="text-[10px] text-gray-400 font-normal">Sync context</span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E5E5] p-5">
              <p className="text-xs font-medium text-gray-500 mb-1">Chatbot Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-700">Active</span>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="flex-1 flex flex-col">
            {documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => {
                  const isPdf = doc.file_type === 'pdf';
                  return (
                    <div
                      key={doc.id}
                      className="bg-white rounded-lg border border-[#E5E5E5] p-4 flex flex-col justify-between hover:border-gray-400 transition-colors"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase ${
                            isPdf ? 'bg-red-500' : 'bg-blue-500'
                          }`}>
                            {doc.file_type}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">{doc.file_size}</span>
                        </div>
                        <h3 className="text-xs font-semibold text-gray-900 mt-2.5 line-clamp-1">{doc.name}</h3>
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-2 leading-relaxed bg-[#F7F7F7] p-2 rounded border border-[#E5E5E5]">
                          {doc.content}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-4 pt-3 border-t border-[#E5E5E5]">
                        <button
                          onClick={() => handleDeleteDoc(doc.id, doc.name)}
                          className="flex-1 py-1.5 text-[11px] font-medium text-red-600 hover:bg-red-50 rounded border border-transparent transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setActiveViewDoc(doc)}
                          className="flex-1 py-1.5 text-[11px] font-medium text-[#2563EB] hover:bg-blue-50 rounded border border-transparent transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="max-w-sm w-full text-center bg-white border border-[#E5E5E5] rounded-lg p-8 flex flex-col items-center gap-3">
                  <h3 className="text-sm font-semibold text-gray-900">No Documents Found</h3>
                  <p className="text-xs text-gray-500">Upload documents to start training the support chatbot.</p>
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="mt-2 px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium rounded cursor-pointer"
                  >
                    Upload Document
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Slide-over File Upload Panel */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsUploadOpen(false)}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-xxs transition-opacity"
          />

          {/* Panel Wrapper */}
          <div className="relative w-full max-w-md bg-white border-l border-[#E5E5E5] flex flex-col justify-between h-full shadow-lg">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E5E5E5] bg-[#F7F7F7] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Upload Document</h2>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUploadSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">PDF File</label>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                  className="px-3 py-2 border border-[#E5E5E5] rounded-md text-xs text-gray-800 focus:outline-none focus:border-gray-400"
                />
                <p className="text-[10px] text-gray-400 mt-1">Only PDF files are supported.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="flex-1 py-2 border border-[#E5E5E5] text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-2 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium rounded-md cursor-pointer flex items-center justify-center"
                >
                  {isUploading ? 'Uploading...' : 'Upload & Train'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {activeViewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setActiveViewDoc(null)}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-xxs transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-white border border-[#E5E5E5] rounded-lg shadow-lg flex flex-col overflow-hidden max-h-[80vh]">
            <div className="px-6 py-4 border-b border-[#E5E5E5] bg-[#F7F7F7] flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800">{activeViewDoc.name}</h3>
              <button
                onClick={() => setActiveViewDoc(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed bg-[#F7F7F7] p-4 rounded border border-[#E5E5E5] whitespace-pre-wrap">
                {activeViewDoc.content}
              </p>
            </div>

            <div className="px-6 py-3 border-t border-[#E5E5E5] bg-[#F7F7F7] flex justify-end">
              <button
                onClick={() => setActiveViewDoc(null)}
                className="px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating success toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-4 py-3 rounded-lg border border-gray-800 shadow-lg text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
