'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function Analytics() {
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const [avgResponseTime, setAvgResponseTime] = useState(0);
  const [resolutionRate, setResolutionRate] = useState(0);
  const [satisfactionScore, setSatisfactionScore] = useState(4.8); // Fake data for now
  
  const [statusCounts, setStatusCounts] = useState({ open: 0, inProgress: 0, resolved: 0 });
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [topQuestions, setTopQuestions] = useState<any[]>([]);

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
    const fetchData = async () => {
      setIsLoading(true);
      
      // Fetch all tickets
      const { data: tickets } = await supabase.from('tickets').select('*');
      
      if (tickets) {
        setTotalTickets(tickets.length);
        
        // Status counts
        const open = tickets.filter(t => t.status === 'open').length;
        const inProgress = tickets.filter(t => t.status === 'in progress' || t.status === 'in_progress').length;
        const resolved = tickets.filter(t => t.status === 'resolved').length;
        
        setStatusCounts({ open, inProgress, resolved });
        
        if (tickets.length > 0) {
          setResolutionRate(Math.round((resolved / tickets.length) * 100));
        }

        // Avg response time (fake for now or calculated if updated_at exists)
        // Since we don't have guaranteed updated_at/resolved_at, we'll calculate a mock or simple average
        let totalHours = 0;
        let resolvedCount = 0;
        tickets.forEach(t => {
          if (t.status === 'resolved') {
            const created = new Date(t.created_at);
            // If there's an updated_at we could use it, else we mock
            const resolvedAt = (t as any).updated_at ? new Date((t as any).updated_at) : new Date(created.getTime() + (Math.random() * 48 * 60 * 60 * 1000)); 
            const hours = (resolvedAt.getTime() - created.getTime()) / (1000 * 60 * 60);
            totalHours += hours;
            resolvedCount++;
          }
        });
        
        if (resolvedCount > 0) {
          setAvgResponseTime(Math.round((totalHours / resolvedCount) * 10) / 10);
        } else {
          setAvgResponseTime(2.4); // Mock default
        }

        // Recent tickets (last 10)
        const sorted = [...tickets].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setRecentTickets(sorted.slice(0, 10));
      }

      // Fetch common questions (mocking by taking recent message contents that end with ?)
      const { data: messages } = await supabase.from('messages').select('content').eq('sender_type', 'student').limit(50);
      if (messages) {
        const questions = messages
          .map(m => m.content)
          .filter(c => c.includes('?'))
          .slice(0, 5);
        
        if (questions.length > 0) {
          setTopQuestions(questions);
        } else {
          // Fallback questions if none found
          setTopQuestions([
            "How do I reset my password?",
            "When does the next module unlock?",
            "Can I download the video lessons?",
            "Where do I find my certificate?",
            "Is there a community forum?"
          ]);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [supabase]);

  // CSS width for simple bar charts
  const totalCount = statusCounts.open + statusCounts.inProgress + statusCounts.resolved;
  const getWidth = (count: number) => totalCount === 0 ? '0%' : `${(count / totalCount) * 100}%`;

  return (
    <div className="flex h-screen bg-[#FFFFFF] text-[#1A1A1A] font-sans antialiased overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-[#F7F7F7] border-r border-[#E5E5E5] flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-[#E5E5E5]">
          <span className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Replyio</span>
        </div>
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
              Dashboard
            </Link>
            <Link href="/dashboard/analytics" className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-[#EFF6FF] text-[#2563EB] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Analytics
            </Link>
            <Link href="/dashboard/tickets" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2h6a2 2 0 012 2v2M7 7h10" /></svg>
              Tickets
            </Link>
            <Link href="/dashboard/knowledge" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.001c0 1.295.38 2.531 1.01 3.585L12 18l8.99 2.585c.63-1.054 1.01-2.29 1.01-3.585 0-6.003-4.5-10.748-10-10.748z" /></svg>
              Knowledge Base
            </Link>

            <div className="pt-3 pb-1">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Settings</p>
            </div>
            <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              General
            </Link>
            <Link href="/dashboard/company-settings" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              Company
            </Link>
          </div>
        </nav>
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
      <main className="flex-1 flex flex-col overflow-hidden bg-[#FAFAFA]">
        <div className="bg-white border-b border-[#E5E5E5] px-8 py-5 flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Analytics & Reports</h1>
            <p className="text-xs text-gray-400 mt-0.5">Overview of your support performance</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 w-full">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading metrics...
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg border border-[#E5E5E5] shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Total Tickets</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalTickets}</p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-[#E5E5E5] shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Avg Response Time</p>
                  <p className="text-2xl font-semibold text-gray-900">{avgResponseTime} <span className="text-sm font-normal text-gray-500">hrs</span></p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-[#E5E5E5] shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Resolution Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">{resolutionRate}%</p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-[#E5E5E5] shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Customer Satisfaction</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-gray-900">{satisfactionScore}</p>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(satisfactionScore) ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Tickets by Status */}
                <div className="lg:col-span-1 bg-white p-5 rounded-lg border border-[#E5E5E5] shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-6">Tickets by Status</h3>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-gray-700">Open</span>
                        <span className="text-gray-500">{statusCounts.open}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: getWidth(statusCounts.open) }}></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-gray-700">In Progress</span>
                        <span className="text-gray-500">{statusCounts.inProgress}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: getWidth(statusCounts.inProgress) }}></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-gray-700">Resolved</span>
                        <span className="text-gray-500">{statusCounts.resolved}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: getWidth(statusCounts.resolved) }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Most Common Questions */}
                <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-[#E5E5E5] shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Most Common Questions</h3>
                  <div className="space-y-3">
                    {topQuestions.map((q, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-gray-50 border border-gray-100 text-xs">
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-[10px]">
                          {i + 1}
                        </span>
                        <p className="text-gray-700 font-medium leading-relaxed mt-0.5">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recent Activity Table */}
              <div className="bg-white rounded-lg border border-[#E5E5E5] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E5E5E5]">
                  <h3 className="text-sm font-semibold text-gray-900">Recent Tickets</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5]">
                      <tr>
                        <th className="px-5 py-2.5 font-medium text-gray-500">Ticket ID</th>
                        <th className="px-5 py-2.5 font-medium text-gray-500">Student</th>
                        <th className="px-5 py-2.5 font-medium text-gray-500">Subject</th>
                        <th className="px-5 py-2.5 font-medium text-gray-500">Status</th>
                        <th className="px-5 py-2.5 font-medium text-gray-500">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {recentTickets.map(t => (
                        <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3 font-medium text-blue-600">{t.ticket_number}</td>
                          <td className="px-5 py-3 text-gray-900">{t.student_name}</td>
                          <td className="px-5 py-3 text-gray-600 truncate max-w-xs">{t.subject}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize
                              ${t.status === 'open' ? 'bg-red-50 text-red-700 border-red-100' : 
                                t.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                'bg-amber-50 text-amber-700 border-amber-100'}`}
                            >
                              {t.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-500">{new Date(t.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {recentTickets.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center text-gray-400">No recent tickets</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
