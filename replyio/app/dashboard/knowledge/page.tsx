'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from "@/lib/supabase";

interface DocumentFile {
  id: string;
  name: string;
  extension: 'pdf' | 'docx';
  size: string;
  date: string;
  content: string;
}

const initialDocuments: DocumentFile[] = [
  { id: 'DOC-001', name: 'Course FAQ 2026.pdf', extension: 'pdf', size: '1.2 MB', date: 'May 25, 2026', content: 'This document contains the Frequently Asked Questions for the 2026 Academy Courses, detailing system requirements, schedule policies, exam formats, and teacher support hours. All students should read this prior to starting Module 1.' },
  { id: 'DOC-002', name: 'Pricing Guide.pdf', extension: 'pdf', size: '840 KB', date: 'May 24, 2026', content: 'Our 2026 Pricing Guide covers basic subscription tiers, enterprise packages, student discount coupons, installment plans, and regional pricing adjustments. Currency rates and platform transaction taxes are listed on Page 4.' },
  { id: 'DOC-003', name: 'Refund Policy.docx', extension: 'docx', size: '120 KB', date: 'May 22, 2026', content: 'Refund Policy: Students are eligible for a 100% money-back guarantee within 14 days of purchase, provided they have completed less than 20% of course lessons. Submit requests directly via billing@academy.com.' },
  { id: 'DOC-004', name: 'Syllabus - Javascript Basics.pdf', extension: 'pdf', size: '2.4 MB', date: 'May 20, 2026', content: 'Javascript Basics Syllabus covering: Variables, Scope, Control Flow, Arrays, Object Prototypes, Asynchronous JavaScript (Promises & async/await), and modern ES6+ paradigms. Includes 12 practice exercises and a final project.' },
  { id: 'DOC-005', name: 'Student Handbook.pdf', extension: 'pdf', size: '4.1 MB', date: 'May 15, 2026', content: 'Official Student Handbook covering code of conduct, grading criteria, certificate eligibility criteria, forum moderation guidelines, and plagiarism policy. Violation of these policies may result in account termination.' },
  { id: 'DOC-006', name: 'API Integration Sandbox Guide.pdf', extension: 'pdf', size: '1.8 MB', date: 'May 12, 2026', content: 'API Sandbox Guide: Details rate limiting headers, sandbox authentication keys, webhook signature validations, and testing mock JSON payloads for all academy REST endpoints. Production endpoints require verification.' },
  { id: 'DOC-007', name: 'Welcome Package.docx', extension: 'docx', size: '310 KB', date: 'May 10, 2026', content: 'Welcome to the Academy! This package contains Discord server invitations, initial workspace setup checklists, Git workflow configurations, and calendar invites for weekly live programming office hours.' },
  { id: 'DOC-008', name: 'Support Guidelines.pdf', extension: 'pdf', size: '650 KB', date: 'May 05, 2026', content: 'Guidelines for student support queries. Details ticket response SLA guarantees (High: 4 hours, Medium: 12 hours, Low: 24 hours), how to request code reviews, and acceptable formats for logs and screenshots.' },
];

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<DocumentFile[]>(initialDocuments);
  const [lastUpdated, setLastUpdated] = useState('Today');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeViewDoc, setActiveViewDoc] = useState<DocumentFile | null>(null);

  const [uploadName, setUploadName] = useState('');
  const [uploadExtension, setUploadExtension] = useState<'pdf' | 'docx'>('pdf');
  const [uploadSize, setUploadSize] = useState('450 KB');
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

  const handleDeleteDoc = (id: string, name: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    setToastMessage(`"${name}" deleted successfully.`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) return;

    let finalizedName = uploadName.trim();
    if (!finalizedName.toLowerCase().endsWith(`.${uploadExtension}`)) {
      finalizedName += `.${uploadExtension}`;
    }

    const newIdNum = documents.length + 1;
    const newId = `DOC-${newIdNum.toString().padStart(3, '0')}`;

    const newDoc: DocumentFile = {
      id: newId,
      name: finalizedName,
      extension: uploadExtension,
      size: uploadSize,
      date: 'May 27, 2026',
      content: `This is a mock training document uploaded for "${finalizedName}". This file will be processed, chunked, and embedded into the vector database to train the AI Support Chatbot context.`,
    };

    setDocuments([newDoc, ...documents]);
    setLastUpdated('Just now');
    setIsUploadOpen(false);

    setUploadName('');
    setUploadExtension('pdf');
    setUploadSize('450 KB');

    setToastMessage(`"${finalizedName}" uploaded and trained successfully.`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
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
            <Link href="/dashboard/knowledge" className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-[#EFF6FF] text-[#2563EB] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.001c0 1.295.38 2.531 1.01 3.585L12 18l8.99 2.585c.63-1.054 1.01-2.29 1.01-3.585 0-6.003-4.5-10.748-10-10.748z" />
              </svg>
              Knowledge Base
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A] text-sm font-medium transition-colors">
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
                  const isPdf = doc.extension === 'pdf';
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
                            {doc.extension}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">{doc.size}</span>
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
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Document Name</label>
                <input
                  type="text"
                  required
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Grading Guidelines"
                  className="px-3 py-2 border border-[#E5E5E5] rounded-md text-xs text-gray-800 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Document Format</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`border rounded-md p-2 flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs ${
                    uploadExtension === 'pdf' ? 'border-[#2563EB] text-[#2563EB] font-medium' : 'border-[#E5E5E5] text-gray-500'
                  }`}>
                    <input
                      type="radio"
                      name="extension"
                      checked={uploadExtension === 'pdf'}
                      onChange={() => setUploadExtension('pdf')}
                      className="sr-only"
                    />
                    <span>PDF</span>
                  </label>
                  <label className={`border rounded-md p-2 flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs ${
                    uploadExtension === 'docx' ? 'border-[#2563EB] text-[#2563EB] font-medium' : 'border-[#E5E5E5] text-gray-500'
                  }`}>
                    <input
                      type="radio"
                      name="extension"
                      checked={uploadExtension === 'docx'}
                      onChange={() => setUploadExtension('docx')}
                      className="sr-only"
                    />
                    <span>DOCX</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">File Size</label>
                <select
                  value={uploadSize}
                  onChange={(e) => setUploadSize(e.target.value)}
                  className="w-full px-2.5 py-2 border border-[#E5E5E5] bg-white rounded-md text-xs text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="120 KB">120 KB</option>
                  <option value="450 KB">450 KB</option>
                  <option value="1.5 MB">1.5 MB</option>
                </select>
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
                  className="flex-1 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium rounded-md cursor-pointer"
                >
                  Upload & Train
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
