"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardCharts({ stats, scores }: { stats: any, scores: number[] }) {
  
  // Prepare Data for Status Pie Chart
  const statusData = [
    { name: "Menunggu", value: stats.pending, color: "#eab308" }, // yellow-500
    { name: "Diterima", value: stats.approved, color: "#22c55e" }, // green-500
    { name: "Ditolak", value: stats.rejected, color: "#ef4444" }, // red-500
  ].filter(d => d.value > 0);

  // Prepare Data for Score Distribution (Histogram)
  const scoreBuckets = [
    { range: "0-40", count: 0 },
    { range: "41-60", count: 0 },
    { range: "61-80", count: 0 },
    { range: "81-100", count: 0 },
  ];

  scores.forEach(s => {
    if (s <= 40) scoreBuckets[0].count++;
    else if (s <= 60) scoreBuckets[1].count++;
    else if (s <= 80) scoreBuckets[2].count++;
    else scoreBuckets[3].count++;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Status Overview */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Status Aplikasi Relawan</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Score Distribution */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Distribusi Nilai Seleksi</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={scoreBuckets}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" name="Jumlah Peserta" />
             </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
