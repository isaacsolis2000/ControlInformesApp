import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  TextField,
  MenuItem,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import { Loader } from '../components';
import { reportesService } from '../services/reportesService';
import type { ResumenMensual } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const MESES = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

interface KpiCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  gradient: string;
  subtitle?: string;
}

function KpiCard({ title, value, icon, gradient, subtitle }: KpiCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        background: '#fff',
        border: '1px solid rgba(145,158,171,0.12)',
        '&:hover': { transform: 'translateY(-3px)' },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="body2"
              sx={{ color: '#637381', fontWeight: 500, mb: 0.5, fontSize: '0.82rem' }}
            >
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color: '#1a2027', lineHeight: 1.2, fontWeight: 700 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.5, display: 'block' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 6px 16px rgba(0,0,0,0.14)',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

const PIE_COLORS = ['#1976d2', '#42a5f5', '#90caf9'];

const currentDate = new Date();

export default function DashboardPage() {
  const [resumen, setResumen] = useState<ResumenMensual | null>(null);
  const [loading, setLoading] = useState(false);
  const [ano, setAno] = useState(currentDate.getFullYear());
  const [mes, setMes] = useState(currentDate.getMonth() + 1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await reportesService.getResumenMensual(ano, mes);
        setResumen(data);
      } catch {
        // Error handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ano, mes]);

  if (loading) return <Loader />;

  const pieData = resumen
    ? [
        { name: 'Publicadores', value: resumen.publicadores.total },
        { name: 'Prec. Auxiliares', value: resumen.precursoresAuxiliares.total },
        { name: 'Prec. Regulares', value: resumen.precursoresRegulares.total },
      ]
    : [];

  const barData = resumen
    ? [
        { name: 'Publicadores', cantidad: resumen.publicadores.total, fill: '#1976d2' },
        { name: 'Prec. Aux.', cantidad: resumen.precursoresAuxiliares.total, fill: '#42a5f5' },
        { name: 'Prec. Reg.', cantidad: resumen.precursoresRegulares.total, fill: '#90caf9' },
      ]
    : [];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#1a2027' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#637381', mt: 0.5 }}>
            Resumen general del sistema
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TextField
            select
            label="Mes"
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            size="small"
            sx={{ width: 140 }}
          >
            {MESES.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Año"
            type="number"
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            size="small"
            sx={{ width: 100 }}
            slotProps={{ htmlInput: { min: 2000, max: 2100 } }}
          />
        </Box>
      </Box>

      {!resumen ? (
        <Typography color="text.secondary">No hay datos para el período seleccionado.</Typography>
      ) : (
        <>
          {/* KPI Cards */}
          <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <KpiCard
                title="Publicadores Activos"
                value={resumen.totalPublicadoresActivos}
                icon={<PeopleIcon sx={{ color: '#fff', fontSize: 26 }} />}
                gradient="linear-gradient(135deg, #1565c0, #1976d2)"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <KpiCard
                title="Informes Recibidos"
                value={resumen.cantidadInformes}
                icon={<DescriptionIcon sx={{ color: '#fff', fontSize: 26 }} />}
                gradient="linear-gradient(135deg, #1b5e20, #388e3c)"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <KpiCard
                title="Total Cursos Bíblicos"
                value={resumen.totalCursosBiblicos}
                icon={<SchoolIcon sx={{ color: '#fff', fontSize: 26 }} />}
                gradient="linear-gradient(135deg, #bf360c, #f57c00)"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <KpiCard
                title="Horas Precursores"
                value={resumen.totalHorasPrecursores}
                icon={<AccessTimeIcon sx={{ color: '#fff', fontSize: 26 }} />}
                gradient="linear-gradient(135deg, #4a148c, #7b1fa2)"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <KpiCard
                title="Promedio Asistencia"
                value={resumen.promedioAsistencia.toFixed(1)}
                icon={<GroupsIcon sx={{ color: '#fff', fontSize: 26 }} />}
                gradient="linear-gradient(135deg, #880e4f, #c2185b)"
              />
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={2.5}>
            {/* Pie Chart */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                sx={{
                  p: 3,
                  border: '1px solid rgba(145,158,171,0.12)',
                  height: 320,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontSize: '0.95rem', color: '#1a2027' }}>
                  Tipos de Publicador
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
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
              </Paper>
            </Grid>

            {/* Bar Chart */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper
                sx={{
                  p: 3,
                  border: '1px solid rgba(145,158,171,0.12)',
                  height: 320,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontSize: '0.95rem', color: '#1a2027' }}>
                  Distribución por Categoría
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={barData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f8" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#637381' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#637381' }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: 'none',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                        fontSize: 13,
                      }}
                      cursor={{ fill: 'rgba(25,118,210,0.06)' }}
                    />
                    <Bar dataKey="cantidad" name="Cantidad" radius={[6, 6, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
