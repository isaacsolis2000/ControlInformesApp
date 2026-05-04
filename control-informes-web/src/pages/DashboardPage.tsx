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
import { Loader, KpiCard, DonutChart, BarChartCategoria } from '../components';
import { dashboardService, DashboardDto } from '../services/dashboardService';
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
  const [dashboard, setDashboard] = useState<DashboardDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [ano, setAno] = useState(currentDate.getFullYear());
  const [mes, setMes] = useState(currentDate.getMonth() + 1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getDashboard(ano, mes);
        setDashboard(data);
      } catch {
        // Error handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ano, mes]);

  if (loading) return <Loader />;

  const kpis = dashboard?.Kpis;
  const tipos = dashboard?.TiposPublicador;
  const distribucion = dashboard?.Distribucion || [];

  const donutData = tipos
    ? [
        { name: 'Publicadores', value: tipos.Publicadores },
        { name: 'Prec. Auxiliares', value: tipos.PrecursoresAuxiliares },
        { name: 'Prec. Regulares', value: tipos.PrecursoresRegulares },
      ]
    : [];

  const barData = distribucion.map((d) => ({ name: d.Tipo, value: d.Informes }));

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#1a2027', fontWeight: 700 }}>
            Dashboard Principal
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#637381', mt: 0.5 }}>
            Datos correspondientes a {MESES.find((m) => m.value === mes)?.label} {ano}
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

      {!dashboard ? (
        <Typography color="text.secondary">No hay datos para el período seleccionado.</Typography>
      ) : (
        <>
          {/* KPI Cards */}
          <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
            <Grid item xs={12} sm={6} md={2.4}>
              <KpiCard
                title="Publicadores Activos"
                value={kpis?.TotalPublicadoresActivos ?? 0}
                icon={<PeopleIcon sx={{ color: '#fff', fontSize: 26 }} />}
                gradient="linear-gradient(135deg, #1565c0, #1976d2)"
                subtitle={`+${dashboard?.Variaciones.CambioInformes?.toFixed(1) ?? 0}%`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <KpiCard
                title="Informes Recibidos"
                value={kpis?.InformesRecibidos ?? 0}
                icon={<DescriptionIcon sx={{ color: '#fff', fontSize: 26 }} />}
                gradient="linear-gradient(135deg, #42a5f5, #90caf9)"
                subtitle={`Meta: —`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <KpiCard
                title="Cursos Bíblicos"
                value={kpis?.TotalCursosBiblicos ?? 0}
                icon={<SchoolIcon sx={{ color: '#fff', fontSize: 26 }} />}
                gradient="linear-gradient(135deg, #f57c00, #fb8c00)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <KpiCard
                title="Horas Precursores"
                value={kpis?.TotalHorasPrecursores ?? 0}
                icon={<AccessTimeIcon sx={{ color: '#fff', fontSize: 26 }} />}
                gradient="linear-gradient(135deg, #7b1fa2, #4a148c)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <KpiCard
                title="Promedio Asistencia"
                value={(kpis?.PromedioAsistencia ?? 0).toFixed(1)}
                icon={<GroupsIcon sx={{ color: '#fff', fontSize: 26 }} />}
                gradient="linear-gradient(135deg, #0d47a1, #1976d2)"
              />
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={5}>
              <DonutChart data={donutData} total={kpis?.TotalPublicadoresActivos ?? 0} title="Tipos de Publicador" />
            </Grid>
            <Grid item xs={12} md={7}>
              <BarChartCategoria data={barData} title="Distribución por Categoría" categories={[]} />
            </Grid>
          </Grid>

          {/* Historial Semestral (tabla simplificada) */}
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ p: 2, border: '1px solid rgba(145,158,171,0.12)' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Historial de Informes Semestral</Typography>
              <Box>
                {/* Tabla simple: mostramos meses y total publicadores */}
                <Grid container spacing={1}>
                  {dashboard.HistorialSemestral.map((h) => (
                    <Grid item xs={12} sm={6} md={4} key={`${h.Ano}-${h.Mes}`}>
                      <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#637381' }}>{h.Mes} {h.Ano}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{h.PublicadoresActivos}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
}
}
