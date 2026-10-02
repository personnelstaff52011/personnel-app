'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { DepartmentStat } from '@/types/personnel';

interface DepartmentBarChartProps {
  data: DepartmentStat[];
}

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#1d4ed8', '#1e40af'];

export default function DepartmentBarChart({ data }: DepartmentBarChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-60 sm:h-72 w-full bg-gray-50 animate-pulse rounded-2xl" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-60 sm:h-72 w-full flex items-center justify-center text-gray-400 text-xs">
        ไม่มีข้อมูลสังกัด
      </div>
    );
  }

  return (
    <div className="w-full h-60 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 15, right: 10, left: -20, bottom: 35 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            angle={-30}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 10, fill: '#64748b' }}
            height={50}
          />
          <YAxis 
            allowDecimals={false} 
            tick={{ fontSize: 10, fill: '#94a3b8' }}
          />
          <Tooltip 
            formatter={(value: any) => [`${value} นาย`, 'จำนวน']}
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              fontSize: '12px'
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
