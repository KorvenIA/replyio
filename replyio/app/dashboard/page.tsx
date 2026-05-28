/* app/dashboard/page.tsx */
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Define types for clarity
// Define types for clarity
interface Ticket {
  ticket_number: string;
  student_name: string;
  subject: string;
  status: string;
  priority: string;
  date: string; // formatted date string
}

export default function Dashboard() {
  // Loading state
  const [loading, setLoading] = useState(true);

  // Stats state
  const [openCount, setOpenCount] = useState<string>("0");
  const [resolvedTodayCount, setResolvedTodayCount] = useState<string>("0");
  const [avgResponseTime, setAvgResponseTime] = useState<string>("-"); // placeholder
  const [totalStudents, setTotalStudents] = useState<string>("0"); // placeholder

  // Tickets state (most recent 5)
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Open tickets count
        const { count: openCnt, error: openErr } = await supabase
          .from("tickets")
          .select("id", { count: "exact", head: true })
          .eq("status", "open");
        if (!openErr && openCnt !== null) setOpenCount(String(openCnt));

        // Resolved today count – assumes a column `created_at` exists
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const { count: resolvedCnt, error: resolvedErr } = await supabase
          .from("tickets")
          .select("id", { count: "exact", head: true })
          .eq("status", "resolved")
          .gte("created_at", `${today} 00:00:00`)
          .lte("created_at", `${today} 23:59:59`);
        if (!resolvedErr && resolvedCnt !== null) setResolvedTodayCount(String(resolvedCnt));

        // Recent tickets (latest 5)
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
            // Transform status to capitalized form for UI
            status: (() => {
              const map: Record<string, string> = {
                open: "Open",
                in_progress: "In Progress",
                resolved: "Resolved",
              };
              return map[t.status] ?? t.status;
            })(),
            // Transform priority to capitalized form for UI
            priority: (() => {
              const map: Record<string, string> = {
                high: "High",
                medium: "Medium",
                low: "Low",
              };
              return map[t.priority] ?? t.priority;
            })(),
            // Keep original created_at for display; format as needed in UI
            date: new Date(t.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })
          }));
          setTickets(formatted);
        }

        // Placeholder stats (replace with real queries as needed)
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

  // Build stats array from state values – keep original layout
  const stats = [
    { label: "Open Tickets", value: openCount, change: "+2 this week" },
    { label: "Resolved Today", value: resolvedTodayCount, change: "+12% vs yesterday" },
    { label: "Avg Response Time", value: avgResponseTime, change: "↓ 15 min" },
    { label: "Total Students", value: totalStudents, change: "+18 new" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-50 text-red-700 border border-red-200";
      case "In Progress":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "Resolved":
        return "bg-green-50 text-green-700 border border-green-200";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 font-semibold";
      case "Medium":
        return "text-yellow-600 font-semibold";
      case "Low":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-700">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A2E] text-white flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-6 py-8 border-b border-[#2A2A3E]">
          <h1 className="text-2xl font-bold text-blue-400">Replyio</h1>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-6 py-8">
          <div className="space-y-4">
            {/* Dashboard Link */}
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium transition-colors">
              Dashboard
            </a>
            {/* Other links omitted for brevity */}
          </div>
        </nav>
        {/* User Profile */}
        <div className="px-6 py-6 border-t border-[#2A2A3E] flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Academy Name</p>
            <p className="text-xs text-gray-400 truncate">admin@academy.com</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            New Ticket
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto px-8 py-8 bg-gray-50">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-600 font-medium mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-3">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Tickets Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length > 0 ? (
                    tickets.map((ticket, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">{ticket.ticket_number}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{ticket.student_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{ticket.subject}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={getPriorityColor(ticket.priority)}>{ticket.priority}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{ticket.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No tickets yet. They will appear here automatically.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <p className="text-sm text-gray-600">Showing {tickets.length} of {tickets.length} tickets</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">View All Tickets →</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
