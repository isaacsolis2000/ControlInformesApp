import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
} from '@mui/material';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { publicadoresService } from '../../services/publicadoresService';
import { useNotificationStore } from '../../stores/notificationStore';
import { TipoResumenPublicador } from '../../types';
import { calcularAnoServicioActual, generarOpcionesAno } from '../../utils/anoServicio';

interface Props {
  open: boolean;
  onClose: () => void;
}

const TIPO_OPTIONS = [
  { value: TipoResumenPublicador.Publicador, label: 'Publicadores' },
  { value: TipoResumenPublicador.PrecursorAuxiliar, label: 'Precursores Auxiliares' },
  { value: TipoResumenPublicador.PrecursorRegular, label: 'Precursores Regulares' },
];

export default function TarjetaResumenModal({ open, onClose }: Props) {
  const [anoSeleccionado, setAnoSeleccionado] = useState<number>(calcularAnoServicioActual());
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoResumenPublicador>(TipoResumenPublicador.Publicador);
  const [loading, setLoading] = useState(false);
  const showNotification = useNotificationStore((s) => s.showNotification);

  const opciones = generarOpcionesAno();

  const handleDescargar = async () => {
    setLoading(true);
    try {
      await publicadoresService.descargarTarjetaResumen(anoSeleccionado, tipoSeleccionado);
      onClose();
    } catch {
      showNotification('Error al descargar la tarjeta resumen PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Descargar Tarjeta Resumen</DialogTitle>
      <DialogContent sx={{ pt: '12px !important' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Año de servicio</InputLabel>
            <Select
              value={anoSeleccionado}
              label="Año de servicio"
              onChange={(e) => setAnoSeleccionado(Number(e.target.value))}
            >
              {opciones.map((op) => (
                <MenuItem key={op.valor} value={op.valor}>
                  {op.etiqueta}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Tipo de publicador</InputLabel>
            <Select
              value={tipoSeleccionado}
              label="Tipo de publicador"
              onChange={(e) => setTipoSeleccionado(Number(e.target.value) as TipoResumenPublicador)}
            >
              {TIPO_OPTIONS.map((op) => (
                <MenuItem key={op.value} value={op.value}>
                  {op.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit" sx={{ color: '#637381' }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleDescargar}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SummarizeIcon />}
        >
          {loading ? 'Descargando...' : 'Descargar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
