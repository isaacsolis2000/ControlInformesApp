import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const BAR_COLORS = ['#1976d2', '#42a5f5', '#90caf9'];

interface BarChartCategoriaProps {
  data: { name: string; value: number; fill?: string }[];
  title: string;
  categories: string[];
}

export function BarChartCategoria({ data, title }: BarChartCategoriaProps) {
  return (
    <Card sx={{ height: 320, border: '1px solid rgba(145,158,171,0.12)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontSize: '0.95rem', color: '#1a2027' }}>{title}</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f8" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#637381' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#637381' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: 13 }} cursor={{ fill: 'rgba(25,118,210,0.06)' }} />
            <Bar dataKey="value" name="Cantidad" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.fill || BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
            <Legend iconType="circle" iconSize={8} formatter={(value) => (<span style={{ fontSize: 13, color: '#637381' }}>{value}</span>)} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
