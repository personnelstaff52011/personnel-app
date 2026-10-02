'use client';

import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BloodGroupStat } from '@/types/personnel';

interface BloodGroupDonutChartProps {
  data: BloodGroupStat[];
}

export default function BloodGroupDonutChart({ data }: BloodGroupDonutChartProps) {
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
        ไม่มีข้อมูลกลุ่มเลือด
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="w-full h-60 sm:h-72 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={48}
            outerRadius={75}
            paddingAngle={3}
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any, name: any) => [
              `${value} นาย (${((Number(value) / total) * 100).toFixed(0)}%)`,
              name
            ]}
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              fontSize: '12px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={32} 
            formatter={(value) => <span className="text-[11px] font-bold text-gray-700">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
