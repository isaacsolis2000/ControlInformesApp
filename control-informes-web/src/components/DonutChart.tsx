import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PIE_COLORS = ['#1976d2', '#42a5f5', '#90caf9'];

interface DonutChartProps {
  data: { name: string; value: number }[];
  total: number;
  title: string;
}

export function DonutChart({ data, total, title }: DonutChartProps) {
  return (
    <Card sx={{ height: 320, border: '1px solid rgba(145,158,171,0.12)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontSize: '0.95rem', color: '#1a2027' }}>{title}</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                fontSize: 13,
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: 13, color: '#637381' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 700, fontSize: 18 }}>{total} Total</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
