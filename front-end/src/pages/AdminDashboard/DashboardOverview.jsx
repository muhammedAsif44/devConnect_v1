import React from "react";
import { Users, Calendar, DollarSign, Shield, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardOverview({ dashboardData }) {
  if (!dashboardData) return null;

  const { stats, revenueTrend, userGrowth, sessionActivity } = dashboardData;

  const getIconComponent = (iconName) => {
    const icons = {
      users: Users,
      calendar: Calendar,
      dollar: DollarSign,
      shield: Shield,
    };
    return icons[iconName] || Users;
  };

  const getIconBgColor = (iconName) => {
    const colors = {
      users: "bg-blue-100",
      calendar: "bg-green-100",
      dollar: "bg-blue-100",
      shield: "bg-red-100",
    };
    return colors[iconName] || "bg-gray-100";
  };

  const getIconColor = (iconName) => {
    const colors = {
      users: "text-blue-600",
      calendar: "text-green-600",
      dollar: "text-blue-600",
      shield: "text-red-600",
    };
    return colors[iconName] || "text-gray-600";
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl p-8 mb-8 shadow-xl">
        <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-blue-100">Monitor your platform&apos;s performance and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = getIconComponent(stat.icon);
          const isPositive = stat.change.startsWith("+");

          return (
            <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${getIconBgColor(stat.icon)}`}>
                  <Icon className={getIconColor(stat.icon)} size={24} />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {isPositive ? (
                  <TrendingUp className="text-green-600" size={16} />
                ) : (
                  <TrendingDown className="text-red-600" size={16} />
                )}
                <span className={`font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {stat.change}
                </span>
                <span className="text-gray-500">{stat.vs}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Revenue Trend</h3>
          <p className="text-sm text-gray-500 mb-6">Monthly revenue growth over time</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666" />
              <YAxis tick={{ fontSize: 12 }} stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#1e40af"
                strokeWidth={2}
                dot={{ fill: "#1e40af", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">User Growth</h3>
          <p className="text-sm text-gray-500 mb-6">Total users and mentors over time</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMentors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666" />
              <YAxis tick={{ fontSize: 12 }} stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="Users"
              />
              <Area
                type="monotone"
                dataKey="mentors"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorMentors)"
                name="Mentors"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Session Activity Chart */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Session Activity</h3>
          <p className="text-sm text-gray-500 mb-6">Weekly mentoring session breakdown</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sessionActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#666" />
              <YAxis tick={{ fontSize: 12 }} stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
              <Bar dataKey="pending" stackId="a" fill="#ef4444" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
