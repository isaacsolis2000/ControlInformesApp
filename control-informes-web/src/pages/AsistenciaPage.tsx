import { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Paper, Grid } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import { CustomDataGrid, CustomSelect } from '../components';
import { asistenciaService } from '../services/asistenciaService';
import { useNotificationStore } from '../stores/notificationStore';
import type { Asistencia, AsistenciaForm } from '../types';
import dayjs from 'dayjs';

const TIPOS_REUNION = [
  { value: 'Entre semana', label: 'Entre semana' },
  { value: 'Fin de semana', label: 'Fin de semana' },
];

export default function AsistenciaPage() {
  const showNotification = useNotificationStore((s) => s.showNotification);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AsistenciaForm>({
    fecha: dayjs().format('YYYY-MM-DD'),
    tipoReunion: 'Entre semana',
    cantidad: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await asistenciaService.getAll();
      setAsistencias(data);
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (form.cantidad <= 0) {
      showNotification('La cantidad debe ser mayor a 0', 'warning');
      return;
    }
    try {
      await asistenciaService.create(form);
      showNotification('Asistencia registrada', 'success');
      setForm({ fecha: dayjs().format('YYYY-MM-DD'), tipoReunion: 'Entre semana', cantidad: 0 });
      fetchData();
    } catch {
      // Error handled by interceptor
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'fecha',
      headerName: 'Fecha',
      width: 150,
      valueFormatter: (value: string) => dayjs(value).format('DD/MM/YYYY'),
    },
    { field: 'tipoReunion', headerName: 'Tipo de Reunión', flex: 1, minWidth: 150 },
    { field: 'cantidad', headerName: 'Cantidad', width: 120, type: 'number' },
  ];

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 40, height: 40, borderRadius: 2.5,
            background: 'linear-gradient(135deg, #01579b, #0288d1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(2,136,209,0.25)',
          }}
        >
          <EventIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ color: '#1a2027' }}>Asistencia</Typography>
          <Typography variant="body2" sx={{ color: '#637381' }}>Registro de reuniones</Typography>
        </Box>
      </Box>

      {/* Form */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: '1px solid rgba(145,158,171,0.12)',
          background: 'linear-gradient(135deg, #f8fbff 0%, #fff 100%)',
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1a2027', mb: 2 }}>
          Registrar Asistencia
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Fecha"
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <CustomSelect
              label="Tipo de Reunión"
              value={form.tipoReunion}
              options={TIPOS_REUNION}
              onChange={(val) => setForm({ ...form, tipoReunion: val as string })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="Cantidad"
              type="number"
              value={form.cantidad}
              onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) })}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleSubmit}
              fullWidth
              sx={{ borderRadius: 2.5 }}
            >
              Registrar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <CustomDataGrid rows={asistencias} columns={columns} loading={loading} />
    </Box>
  );
}