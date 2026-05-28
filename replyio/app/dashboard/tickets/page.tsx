'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from "@/lib/supabase";

interface Ticket {
  id: string;
  student: string;
  email: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  date: string;
}

const initialTickets: Ticket[] = [
  { id: 'TK-001', student: 'Sarah Johnson', email: 'sarah.johnson@email.com', subject: 'How to access course materials?', status: 'Open', priority: 'High', date: '2 hours ago' },
  { id: 'TK-002', student: 'Miguel Rodriguez', email: 'miguel.rodriguez@email.com', subject: 'Certificate generation issue', status: 'In Progress', priority: 'Medium', date: '4 hours ago' },
  { id: 'TK-003', student: 'Emma Chen', email: 'emma.chen@email.com', subject: 'Payment method not accepted', status: 'Resolved', priority: 'High', date: 'Yesterday' },
  { id: 'TK-004', student: 'James Wilson', email: 'james.wilson@email.com', subject: 'Can I get a refund?', status: 'Open', priority: 'Low', date: '1 day ago' },
  { id: 'TK-005', student: 'Priya Patel', email: 'priya.patel@email.com', subject: 'Module 3 is not loading', status: 'In Progress', priority: 'High', date: '2 days ago' },
  { id: 'TK-006', student: 'Alex Thompson', email: 'alex.thompson@email.com', subject: 'WSL2 environment setup error', status: 'Open', priority: 'High', date: '2 days ago' },
  { id: 'TK-007', student: 'Sofia Martinez', email: 'sofia.martinez@email.com', subject: 'Inquiry about enterprise pricing', status: 'Resolved', priority: 'Low', date: '3 days ago' },
  { id: 'TK-008', student: 'David Kim', email: 'david.kim@email.com', subject: 'API rate limits on free sandbox', status: 'In Progress', priority: 'Medium', date: '4 days ago' },
  { id: 'TK-009', student: 'Chloe Dupont', email: 'chloe.dupont@email.com', subject: 'Incorrect invoice billing details', status: 'Open', priority: 'Medium', date: '5 days ago' },
  { id: 'TK-010', student: 'Marcus Aurelius', email: 'marcus.aurelius@email.com', subject: 'Feedback on Chapter 4 exercises', status: 'Resolved', priority: 'Low', date: '1 week ago' },
];

export default function TicketsList() {
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newStudent, setNewStudent] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
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

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.student.toLowerCase().includes(search.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [search, statusFilter, priorityFilter, totalPages, currentPage]);

  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-50 text-red-700 border border-red-100';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 font-medium';
      case 'Medium':
        return 'text-amber-600 font-medium';
      case 'Low':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.trim() || !newEmail.trim() || !newSubject.trim()) return;

    const newIdNum = tickets.length + 1;
    const newId = `TK-${newIdNum.toString().padStart(3, '0')}`;

    const newTicket: Ticket = {
      id: newId,
      student: newStudent,
      email: newEmail,
      subject: newSubject,
      status: 'Open',
      priority: newPriority,
      date: 'Just now',
    };

    setTickets([newTicket, ...tickets]);

    setNewStudent('');
    setNewEmail('');
    setNewSubject('');
    setNewPriority('Medium');
    setIsNewTicketOpen(false);

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
            <Link href="/dashboard/tickets" className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-[#EFF6FF] text-[#2563EB] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        
        {/* Top Bar */}
        <div className="bg-white border-b border-[#E5E5E5] px-8 py-5 flex justify-between items-center flex-shrink-0">
          <h1 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Tickets</h1>
          <button
            onClick={() => setIsNewTicketOpen(true)}
            className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-sm cursor-pointer"
          >
             New Ticket
          </button>
        </div>

        {/* Outer Scroll Area */}
        <div className="flex-1 overflow-auto px-8 py-8 flex flex-col gap-6">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-lg border border-[#E5E5E5] flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="w-full pl-8 pr-8 py-1.5 border border-[#E5E5E5] bg-white rounded-md text-xs text-gray-800 focus:outline-none focus:border-gray-400 transition-all"
              />
              <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-44">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-[#E5E5E5] bg-white rounded-md text-xs text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="w-full md:w-44">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-[#E5E5E5] bg-white rounded-md text-xs text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Tickets Table Card */}
          <div className="bg-white rounded-lg border border-[#E5E5E5] flex-1 flex flex-col overflow-hidden">
            {/* Table wrapper */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full min-w-[700px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F7F7F7]">
                    <th className="px-6 py-2.5 text-xs font-semibold text-gray-500">ID</th>
                    <th className="px-6 py-2.5 text-xs font-semibold text-gray-500">Student</th>
                    <th className="px-6 py-2.5 text-xs font-semibold text-gray-500">Subject</th>
                    <th className="px-6 py-2.5 text-xs font-semibold text-gray-500">Status</th>
                    <th className="px-6 py-2.5 text-xs font-semibold text-gray-500">Priority</th>
                    <th className="px-6 py-2.5 text-xs font-semibold text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {paginatedTickets.length > 0 ? (
                    paginatedTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                        className="hover:bg-[#FAFAFA] cursor-pointer transition-colors text-xs"
                      >
                        <td className="px-6 py-3.5 font-medium text-[#2563EB] hover:underline">
                          {ticket.id}
                        </td>
                        <td className="px-6 py-3.5 text-gray-900 font-medium">
                          {ticket.student}
                        </td>
                        <td className="px-6 py-3.5 text-gray-600 max-w-md truncate">
                          {ticket.subject}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-gray-500">
                          {ticket.date}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-xs text-gray-400">
                        No tickets found matching current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-3 bg-[#F7F7F7] border-t border-[#E5E5E5] flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0 text-xs text-gray-500">
              <p>
                Showing{' '}
                <span className="font-medium text-gray-700">
                  {filteredTickets.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}
                </span>{' '}
                to{' '}
                <span className="font-medium text-gray-700">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredTickets.length)}
                </span>{' '}
                of <span className="font-medium text-gray-700">{filteredTickets.length}</span> tickets
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1 text-[11px] font-medium text-gray-600 bg-white border border-[#E5E5E5] rounded hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                        currentPage === page
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-white text-gray-600 border border-[#E5E5E5] hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1 text-[11px] font-medium text-gray-600 bg-white border border-[#E5E5E5] rounded hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Slide-over New Ticket Panel */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsNewTicketOpen(false)}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-xxs transition-opacity"
          />

          {/* Panel Wrapper */}
          <div className="relative w-full max-w-md bg-white border-l border-[#E5E5E5] flex flex-col justify-between h-full shadow-lg">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E5E5E5] bg-[#F7F7F7] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Create Support Ticket</h2>
              </div>
              <button
                onClick={() => setIsNewTicketOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleCreateTicket} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Student Name</label>
                <input
                  type="text"
                  required
                  value={newStudent}
                  onChange={(e) => setNewStudent(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="px-3 py-2 border border-[#E5E5E5] rounded-md text-xs text-gray-800 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. john.doe@email.com"
                  className="px-3 py-2 border border-[#E5E5E5] rounded-md text-xs text-gray-800 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Ticket Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Module 3 is not loading"
                  className="px-3 py-2 border border-[#E5E5E5] rounded-md text-xs text-gray-800 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Priority Level</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-2.5 py-2 border border-[#E5E5E5] bg-white rounded-md text-xs text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="flex-1 py-2 border border-[#E5E5E5] text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium rounded-md cursor-pointer"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating success toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-4 py-3 rounded-lg border border-gray-800 shadow-lg text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>{toastMessage || "Ticket created successfully"}</span>
        </div>
      )}
    </div>
  );
}
