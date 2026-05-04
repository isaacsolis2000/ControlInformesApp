import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Loader, KpiCard, CustomSelect } from '../components';
import { dashboardService } from '../services/dashboardService';
import type { DashboardDto } from '../types';

// ─── constantes ───────────────────────────────────────────────────────────────

const currentDate = new Date();

const ANOS_OPTIONS = Array.from({ length: 5 }, (_, i) => ({
  value: currentDate.getFullYear() - i,
  label: `${currentDate.getFullYear() - i}`,
}));

const MESES_OPTIONS = [
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

const PIE_COLORS = ['#1976d2', '#f57c00', '#7b1fa2', '#2e7d32'];

const BAR_COLORS = {
  publicadores: '#1976d2',
  precursoresAuxiliares: '#f57c00',
  precursoresRegulares: '#7b1fa2',
};

// ─── helpers variación ────────────────────────────────────────────────────────

function VariacionChip({ variacion }: { variacion: number }) {
  if (variacion > 0) {
    return (
      <Chip
        icon={<TrendingUpIcon sx={{ fontSize: '14px !important' }} />}
        label={`+${variacion}`}
        size="small"
        sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700, height: 22, fontSize: '0.72rem' }}
      />
    );
  }
  if (variacion < 0) {
    return (
      <Chip
        icon={<TrendingDownIcon sx={{ fontSize: '14px !important' }} />}
        label={`${variacion}`}
        size="small"
        sx={{ bgcolor: '#ffebee', color: '#c62828', fontWeight: 700, height: 22, fontSize: '0.72rem' }}
      />
    );
  }
  return (
    <Chip
      label="—"
      size="small"
      sx={{ bgcolor: '#f5f5f5', color: '#9e9e9e', fontWeight: 700, height: 22, fontSize: '0.72rem' }}
    />
  );
}

// ─── componente ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [ano, setAno] = useState(currentDate.getFullYear());
  const [mes, setMes] = useState(currentDate.getMonth() + 1);

  useEffect(() => {
    setLoading(true);
    dashboardService
      .getDashboard(ano, mes)
      .then(setDashboard)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ano, mes]);

  if (loading) return <Loader />;

  // datos para gráficas
  const donutData = dashboard
    ? dashboard.distribucionPorTipo.map((d) => ({ name: d.tipo, value: d.cantidad }))
    : [];

  const barData = dashboard
    ? dashboard.historialSemestral.map((h) => ({
        mes: `${h.mes}`,
        Publicadores: h.publicadores,
        'Prec. Auxiliares': h.precursoresAuxiliares,
        'Prec. Regulares': h.precursoresRegulares,
      }))
    : [];

  const totalDonut = dashboard?.totalPublicadoresActivos ?? 0;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#1a2027', fontWeight: 700 }}>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#637381', mt: 0.5 }}>
            {MESES_OPTIONS.find((m) => m.value === mes)?.label} {ano}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Box sx={{ width: 160 }}>
            <CustomSelect label="Mes" value={mes} options={MESES_OPTIONS} onChange={(v) => setMes(v as number)} />
          </Box>
          <Box sx={{ width: 120 }}>
            <CustomSelect label="Año" value={ano} options={ANOS_OPTIONS} onChange={(v) => setAno(v as number)} />
          </Box>
        </Box>
      </Box>

      {!dashboard ? (
        <Typography color="text.secondary">No hay datos para el período seleccionado.</Typography>
      ) : (
        <>
          {/* ── KPI CARDS ─────────────────────────────────────────────────────── */}
          <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
            {/* Publicadores activos */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                title="Publicadores Activos"
                value={dashboard.totalPublicadoresActivos}
                icon={<PeopleIcon sx={{ color: '#fff', fontSize: 24 }} />}
                gradient="linear-gradient(135deg,#1565c0,#1976d2)"
              />
            </Grid>

            {/* Inactivos */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                title="Inactivos"
                value={dashboard.totalInactivos}
                icon={<PeopleOutlinedIcon sx={{ color: '#fff', fontSize: 24 }} />}
                gradient="linear-gradient(135deg,#546e7a,#78909c)"
              />
            </Grid>

            {/* Publicadores — informes */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                title="Informes — Publicadores"
                value={dashboard.publicadores.cantidadInformes}
                icon={<DescriptionIcon sx={{ color: '#fff', fontSize: 24 }} />}
                gradient="linear-gradient(135deg,#5e35b1,#7e57c2)"
                badge={<VariacionChip variacion={dashboard.publicadores.variacion} />}
              />
            </Grid>

            {/* Precursores Auxiliares */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                title="Informes — Prec. Auxiliares"
                value={dashboard.precursoresAuxiliares.cantidadInformes}
                icon={<AccessTimeIcon sx={{ color: '#fff', fontSize: 24 }} />}
                gradient="linear-gradient(135deg,#e65100,#f57c00)"
                badge={<VariacionChip variacion={dashboard.precursoresAuxiliares.variacion} />}
              />
            </Grid>

            {/* Precursores Regulares */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                title="Informes — Prec. Regulares"
                value={dashboard.precursoresRegulares.cantidadInformes}
                icon={<AccessTimeIcon sx={{ color: '#fff', fontSize: 24 }} />}
                gradient="linear-gradient(135deg,#c62828,#e53935)"
                badge={<VariacionChip variacion={dashboard.precursoresRegulares.variacion} />}
              />
            </Grid>

            {/* Reuniones Públicas */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                title="Reuniones Públicas"
                value={dashboard.reunionesPublicas.cantidadReuniones}
                subtitle={`Promedio: ${dashboard.reunionesPublicas.promedio}`}
                icon={<MeetingRoomIcon sx={{ color: '#fff', fontSize: 24 }} />}
                gradient="linear-gradient(135deg,#00695c,#00897b)"
                badge={<VariacionChip variacion={dashboard.reunionesPublicas.variacion} />}
              />
            </Grid>

            {/* Reuniones Servicio */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                title="Reuniones Servicio"
                value={dashboard.reunionesServicio.cantidadReuniones}
                subtitle={`Promedio: ${dashboard.reunionesServicio.promedio}`}
                icon={<MeetingRoomIcon sx={{ color: '#fff', fontSize: 24 }} />}
                gradient="linear-gradient(135deg,#01579b,#0288d1)"
                badge={<VariacionChip variacion={dashboard.reunionesServicio.variacion} />}
              />
            </Grid>
          </Grid>

          {/* ── GRÁFICAS ──────────────────────────────────────────────────────── */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Pastel — distribución por tipo */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Card sx={{ height: 340, border: '1px solid rgba(145,158,171,0.12)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, fontSize: '0.95rem', color: '#1a2027' }}>
                    Distribución por Tipo
                  </Typography>
                  <ResponsiveContainer width="100%" height={230}>
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {donutData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <ReTooltip
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: 13 }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(v) => <span style={{ fontSize: 13, color: '#637381' }}>{v}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 700, fontSize: 16 }}>
                      {totalDonut} Total activos
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Barras — historial semestral */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Card sx={{ height: 340, border: '1px solid rgba(145,158,171,0.12)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, fontSize: '0.95rem', color: '#1a2027' }}>
                    Historial Semestral
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={barData} barSize={14}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f8" vertical={false} />
                      <XAxis
                        dataKey="mes"
                        tick={{ fontSize: 11, fill: '#637381' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#637381' }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <ReTooltip
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: 13 }}
                        cursor={{ fill: 'rgba(25,118,210,0.06)' }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(v) => <span style={{ fontSize: 12, color: '#637381' }}>{v}</span>}
                      />
                      <Bar dataKey="Publicadores" fill={BAR_COLORS.publicadores} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Prec. Auxiliares" fill={BAR_COLORS.precursoresAuxiliares} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Prec. Regulares" fill={BAR_COLORS.precursoresRegulares} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ── HISTORIAL EN TABLA ───────────────────────────────────────────── */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(145,158,171,0.12)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a2027', mb: 2 }}>
              Detalle semestral
            </Typography>
            <Grid container spacing={1.5}>
              {dashboard.historialSemestral.map((h) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`${h.ano}-${h.mes}`}>
                  <Paper
                    elevation={0}
                    sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(145,158,171,0.12)', bgcolor: '#fafbff' }}
                  >
                    <Typography variant="subtitle2" sx={{ color: '#637381', mb: 1 }}>
                      {h.mes} {h.ano}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Pub.</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: BAR_COLORS.publicadores }}>
                          {h.publicadores}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Aux.</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: BAR_COLORS.precursoresAuxiliares }}>
                          {h.precursoresAuxiliares}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Reg.</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: BAR_COLORS.precursoresRegulares }}>
                          {h.precursoresRegulares}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </>
      )}
    </Box>
  );
}
