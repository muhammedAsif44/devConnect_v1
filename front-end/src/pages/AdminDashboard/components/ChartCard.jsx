
import React from 'react';
import { LineChart, Line, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MoreVertical } from 'lucide-react';


function ChartCard({ title, subtitle, data, chartType, dataKey, strokeColor }) {
  // Fallback to sample data if empty
  const chartData = data && data.length > 0 ? data : [
    { name: "Week 1", value: 400 },
    { name: "Week 2", value: 600 },
    { name: "Week 3", value: 800 },
    { name: "Week 4", value: 1000 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <Tooltip 
                contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                labelStyle={{ color: "#000" }}
              />
              <Line type="monotone" dataKey={dataKey} stroke={strokeColor} strokeWidth={3} dot={false} />
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <Tooltip 
                contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                labelStyle={{ color: "#000" }}
              />
              <Bar dataKey={dataKey} fill={strokeColor} radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartCard