
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Event, EventCategory } from '../../types';

interface EventCategoryChartProps {
  events: Event[];
}

const EventCategoryChart: React.FC<EventCategoryChartProps> = ({ events }) => {
  const data = useMemo(() => {
    const categoryCounts = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<EventCategory, number>);

    return Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    }));
  }, [events]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-96">
        <h3 className="text-xl font-bold text-dark mb-4">Event Categories</h3>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 25,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} interval={0} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#0077b6" name="Number of Events" />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default EventCategoryChart;