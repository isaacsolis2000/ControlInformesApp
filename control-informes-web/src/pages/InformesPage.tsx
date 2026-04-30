import { useState } from 'react';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import { CustomDataGrid, CustomSelect } from '../components';
import { informesService } from '../services/informesService';
import type { InformeMensual } from '../types';

const currentYear = new Date().getFullYear();

const ANOS_OPTIONS = Array.from({ length: 5 }, (_, i) => ({
  value: currentYear - i,
  label: `${currentYear - i}`,
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

export default function InformesPage() {
  const [ano, setAno] = useState<number>(currentYear);
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [informes, setInformes] = useState<InformeMensual[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    setLoading(true);
    try {
      const data = await informesService.getAll(ano, mes);
      setInformes(data);
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'nombrePublicador', headerName: 'Publicador', flex: 1, minWidth: 200 },
    { field: 'tipo', headerName: 'Tipo', width: 180 },
    {
      field: 'participo',
      headerName: 'Participó',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Sí' : 'No'}
          size="small"
          sx={{
            fontWeight: 600,
            bgcolor: params.value ? '#e8f5e9' : '#f5f5f5',
            color: params.value ? '#2e7d32' : '#9e9e9e',
            border: `1px solid ${params.value ? '#a5d6a7' : '#e0e0e0'}`,
          }}
        />
      ),
    },
    { field: 'cursos', headerName: 'Cursos', width: 100, type: 'number' },
    { field: 'horas', headerName: 'Horas', width: 100, type: 'number' },
  ];

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 40, height: 40, borderRadius: 2.5,
            background: 'linear-gradient(135deg, #1565c0, #1976d2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(25,118,210,0.25)',
          }}
        >
          <DescriptionIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ color: '#1a2027' }}>Informes Mensuales</Typography>
          <Typography variant="body2" sx={{ color: '#637381' }}>Consulta por período</Typography>
        </Box>
      </Box>

      {/* Filter bar */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 2.5, border: '1px solid rgba(145,158,171,0.12)', display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Box sx={{ width: 150 }}>
          <CustomSelect label="Año" value={ano} options={ANOS_OPTIONS} onChange={(val) => setAno(val as number)} />
        </Box>
        <Box sx={{ width: 180 }}>
          <CustomSelect label="Mes" value={mes} options={MESES_OPTIONS} onChange={(val) => setMes(val as number)} />
        </Box>
        <Button variant="contained" startIcon={<SearchIcon />} onClick={handleBuscar} sx={{ borderRadius: 2.5 }}>
          Buscar
        </Button>
        {informes.length > 0 && (
          <Typography variant="caption" sx={{ color: '#94a3b8', ml: 'auto' }}>
            {informes.length} registro{informes.length !== 1 ? 's' : ''}
          </Typography>
        )}
      </Paper>

      <CustomDataGrid rows={informes} columns={columns} loading={loading} />
    </Box>
  );
}
