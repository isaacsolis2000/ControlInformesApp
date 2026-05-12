import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  CircularProgress,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { asistenciaService } from '../../services/asistenciaService';
import { useNotificationStore } from '../../stores/notificationStore';
import { calcularAnoServicioActual } from '../../utils/anoServicio';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TarjetaReunionesModal({ open, onClose }: Props) {
  const anoActual = calcularAnoServicioActual();
  const [ano1, setAno1] = useState<number>(anoActual);
  const [ano2, setAno2] = useState<number>(anoActual + 1);
  const [loading, setLoading] = useState(false);
  const showNotification = useNotificationStore((s) => s.showNotification);

  const anosIguales = ano1 === ano2;
  const invalido = anosIguales || !ano1 || !ano2;

  const handleDescargar = async () => {
    if (invalido) return;
    setLoading(true);
    try {
      await asistenciaService.descargarTarjetaReuniones(ano1, ano2);
      onClose();
    } catch {
      showNotification('Error al descargar la tarjeta de reuniones', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Descargar Tarjeta de Reuniones</DialogTitle>
      <DialogContent sx={{ pt: '12px !important' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#637381' }}>
            Descarga la tarjeta con el registro de asistencia de dos años de servicio.
          </Typography>
          <TextField
            label="Año de servicio 1"
            type="number"
            size="small"
            fullWidth
            value={ano1}
            onChange={(e) => setAno1(Number(e.target.value))}
            slotProps={{ htmlInput: { min: 2000, max: 2100 } }}
            error={anosIguales}
          />
          <TextField
            label="Año de servicio 2"
            type="number"
            size="small"
            fullWidth
            value={ano2}
            onChange={(e) => setAno2(Number(e.target.value))}
            slotProps={{ htmlInput: { min: 2000, max: 2100 } }}
            error={anosIguales}
            helperText={anosIguales ? 'Los años deben ser diferentes' : undefined}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit" sx={{ color: '#637381' }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleDescargar}
          disabled={loading || invalido}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <PictureAsPdfIcon />}
        >
          {loading ? 'Descargando...' : 'Descargar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
