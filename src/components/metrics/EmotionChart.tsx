
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface EmotionChartProps {
  data: Array<{
    date: string;
    confidence: number;
    motivation: number;
    stress: number;
    satisfaction: number;
  }>;
}

const EmotionChart: React.FC<EmotionChartProps> = ({ data }) => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Format data for the chart
  const chartData = sortedData.map(item => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM dd')
  }));

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-base font-medium mb-4">Your Emotional Journey</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 10]} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 30, 0.8)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white'
                }}
                formatter={(value: number) => [`${value}`, '']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="confidence"
                name="Confidence"
                stroke="#4ade80"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="motivation"
                name="Motivation"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="satisfaction"
                name="Satisfaction"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="stress"
                name="Stress"
                stroke="#f87171"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionChart;
