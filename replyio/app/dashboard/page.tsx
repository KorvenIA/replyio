/* app/dashboard/page.tsx */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Ticket {
  ticket_number: string;
  student_name: string;
  subject: string;
  status: string;
  priority: string;
  date: string;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [openCount, setOpenCount] = useState<string>("0");
  const [resolvedTodayCount, setResolvedTodayCount] = useState<string>("0");
  const [avgResponseTime, setAvgResponseTime] = useState<string>("-");
  const [totalStudents, setTotalStudents] = useState<string>("0");
  const [tickets, setTickets] = useState<Ticket[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { count: openCnt, error: openErr } = await supabase
          .from("tickets")
          .select("id", { count: "exact", head: true })
          .eq("status", "open");
        if (!openErr && openCnt !== null) setOpenCount(String(openCnt));

        const today = new Date().toISOString().split("T")[0];
        const { count: resolvedCnt, error: resolvedErr } = await supabase
          .from("tickets")
          .select("id", { count: "exact", head: true })
          .eq("status", "resolved")
          .gte("created_at", `${today} 00:00:00`)
          .lte("created_at", `${today} 23:59:59`);
        if (!resolvedErr && resolvedCnt !== null) setResolvedTodayCount(String(resolvedCnt));

        const { data: recentTickets, error: recentErr } = await supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        if (!recentErr && recentTickets) {
          const formatted = recentTickets.map((t: any) => ({
            ticket_number: t.ticket_number,
            student_name: t.student_name,
            subject: t.subject,
            status: (() => {
              const map: Record<string, string> = {
                open: "Open",
                in_progress: "In Progress",
                resolved: "Resolved",
              };
              return map[t.status] ?? t.status;
            })(),
            priority: (() => {
              const map: Record<string, string> = {
                high: "High",
                medium: "Medium",
                low: "Low",
              };
              return map[t.priority] ?? t.priority;
            })(),
            date: new Date(t.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })
          }));
          setTickets(formatted);
        }

        setAvgResponseTime("2h");
        setTotalStudents("340");
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Open Tickets", value: openCount, change: "+2 this week" },
    { label: "Resolved Today", value: resolvedTodayCount, change: "+12% vs yesterday" },
    { label: "Avg Response Time", value: avgResponseTime, change: "↓ 15 min" },
    { label: "Total Students", value: totalStudents, change: "+18 new" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-50 text-red-700 border border-red-100";
      case "In Progress":
        return "bg-amber-50 text-amber-700 border border-amber-100";
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 font-medium";
      case "Medium":
        return "text-amber-600 font-medium";
      case "Low":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FFFFFF]">
        <p className="text-sm font-medium text-gray-500 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FFFFFF] text-[#1A1A1A] font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-60 bg-[#F7F7F7] border-r border-[#E5E5E5] flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[#E5E5E5]">
          <span className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Replyio</span>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-[#EFF6FF] text-[#2563EB] text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              Dashboard
            </Link>
            <Link href="/dashboard/tickets" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A] text-sm font-medium transition-colors">
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
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-[#E5E5E5] px-8 py-5 flex justify-between items-center flex-shrink-0">
          <h1 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Dashboard</h1>
          <button className="px-3.5 py-1.5 bg-[#2563EB] text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors shadow-sm">
            New Ticket
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto px-8 py-8 bg-white">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-[#FFFFFF] rounded-lg border border-[#E5E5E5] p-5">
                <p className="text-xs font-medium text-gray-500 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold tracking-tight text-[#1A1A1A]">{stat.value}</span>
                  <span className="text-[10px] text-gray-400 font-normal">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tickets Table */}
          <div className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-[#E5E5E5] bg-[#F7F7F7]">
              <h2 className="text-sm font-semibold tracking-tight text-[#1A1A1A]">Recent Tickets</h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F7F7F7]">
                    <th className="px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {tickets.length > 0 ? (
                    tickets.map((ticket, index) => (
                      <tr key={index} className="hover:bg-[#FAFAFA] transition-colors cursor-pointer text-xs">
                        <td className="px-6 py-3.5 font-medium text-[#2563EB]">
                          <Link href={`/dashboard/tickets/${ticket.ticket_number}`} className="hover:underline">{ticket.ticket_number}</Link>
                        </td>
                        <td className="px-6 py-3.5 text-gray-900 font-medium">
                          <Link href={`/dashboard/tickets/${ticket.ticket_number}`}>{ticket.student_name}</Link>
                        </td>
                        <td className="px-6 py-3.5 text-gray-600 max-w-xs truncate">
                          <Link href={`/dashboard/tickets/${ticket.ticket_number}`}>{ticket.subject}</Link>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={getPriorityColor(ticket.priority)}>{ticket.priority}</span>
                        </td>
                        <td className="px-6 py-3.5 text-gray-500">{ticket.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-6 text-center text-xs text-gray-400">No tickets yet. They will appear here automatically.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-3.5 border-t border-[#E5E5E5] bg-[#F7F7F7] flex justify-between items-center text-xs">
              <span className="text-gray-500">Showing {tickets.length} of {tickets.length} tickets</span>
              <button className="text-[#2563EB] hover:underline font-medium transition-colors">View All Tickets →</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
