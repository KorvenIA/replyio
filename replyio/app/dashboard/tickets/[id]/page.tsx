'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from "@/lib/supabase";

export default function TicketDetail() {
  const supabase = createClient();
  const [messages, setMessages] = useState([
    { id: 1, author: 'Sarah Johnson', type: 'student', content: 'Hi, I\'ve been trying to access the course materials for Module 3, but I keep getting an error. Can you help me?', timestamp: '2 hours ago' },
    { id: 2, author: 'Academy Support', type: 'academy', content: 'Hi Sarah! Thanks for reaching out. Can you tell me what error message you\'re seeing? This will help me diagnose the issue faster.', timestamp: '1.5 hours ago' },
    { id: 3, author: 'Sarah Johnson', type: 'student', content: 'It says "Error 403: Access Denied". I\'ve already paid for the course and my account should be active.', timestamp: '1 hour ago' },
    { id: 4, author: 'Academy Support', type: 'academy', content: 'Thank you for the details. I\'ve checked your account and found the issue. Your course access was pending verification. I\'ve manually approved it now, so you should be able to access Module 3 immediately. Please try refreshing your browser.', timestamp: '30 minutes ago' },
  ]);

  const [replyText, setReplyText] = useState('');
  const [ticketStatus, setTicketStatus] = useState('open');
  const [ticketPriority, setTicketPriority] = useState('high');
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

  const handleSendReply = () => {
    if (replyText.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        author: 'Academy Support',
        type: 'academy',
        content: replyText,
        timestamp: 'just now'
      }]);
      setReplyText('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
      case 'Open':
        return 'bg-red-50 text-red-700 border border-red-100';
      case 'in_progress':
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'resolved':
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-100';
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
            <Link href="/dashboard/tickets" className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-[#EFF6FF] text-[#2563EB] text-sm font-medium transition-colors">
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
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-[#E5E5E5] px-8 py-5 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/tickets" className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Tickets
            </Link>
            <div className="w-px h-4 bg-gray-300"></div>
            <span className="text-sm font-semibold text-gray-900">TK-001</span>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(ticketStatus)}`}>
              {ticketStatus === 'open' ? 'Open' : ticketStatus === 'in_progress' ? 'In Progress' : 'Resolved'}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex gap-6 px-8 py-8 bg-[#FFFFFF]">
          {/* Left Column - Conversation */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-4 text-xs">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'academy' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-3.5 py-2.5 rounded-lg border ${
                    message.type === 'academy'
                      ? 'bg-[#EFF6FF] text-[#1e40af] border-[#bfdbfe]'
                      : 'bg-[#F7F7F7] text-gray-900 border-[#E5E5E5]'
                  }`}>
                    <p className="font-semibold mb-1">{message.author}</p>
                    <p className="leading-relaxed mb-2">{message.content}</p>
                    <p className="text-[10px] text-gray-400">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            <div className="bg-white rounded-lg border border-[#E5E5E5] p-4">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-400 resize-none text-xs"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSendReply}
                  className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Ticket Details */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-[#F7F7F7] rounded-lg border border-[#E5E5E5] p-5 space-y-5 text-xs">
              <h2 className="font-semibold text-gray-900 border-b border-[#E5E5E5] pb-2 text-xs">Ticket Details</h2>
              
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Student</p>
                <p className="font-medium text-gray-900">Sarah Johnson</p>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                <p className="text-gray-600">sarah.johnson@email.com</p>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Date Created</p>
                <p className="text-gray-600">May 27, 2026 at 2:30 PM</p>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Priority</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#E5E5E5] bg-white rounded-md text-xs text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Status</label>
                <select
                  value={ticketStatus}
                  onChange={(e) => setTicketStatus(e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#E5E5E5] bg-white rounded-md text-xs text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <button className="w-full py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-md font-medium text-xs transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
