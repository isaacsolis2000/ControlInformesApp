import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { publicadoresService } from '../../services/publicadoresService';
import { useNotificationStore } from '../../stores/notificationStore';
import { calcularAnoServicioActual, generarOpcionesAno } from '../../utils/anoServicio';

interface Props {
  open: boolean;
  onClose: () => void;
  publicador: { idPublicador: string; nombrePublicador: string } | null;
}

export default function DescargarTarjetaModal({ open, onClose, publicador }: Props) {
  const [anoSeleccionado, setAnoSeleccionado] = useState<number>(calcularAnoServicioActual());
  const [loading, setLoading] = useState(false);
  const showNotification = useNotificationStore((s) => s.showNotification);

  const opciones = generarOpcionesAno();

  const handleDescargar = async () => {
    if (!publicador) return;
    setLoading(true);
    try {
      await publicadoresService.descargarTarjetaPdf(
        publicador.idPublicador,
        anoSeleccionado,
        publicador.nombrePublicador,
      );
      onClose();
    } catch {
      showNotification('Error al descargar la tarjeta PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Descargar tarjeta</DialogTitle>
      <DialogContent sx={{ pt: '12px !important' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{ color: '#637381', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}
            >
              Publicador
            </Typography>
            <Typography variant="body2" sx={{ color: '#1a2027', mt: 0.25 }}>
              {publicador?.nombrePublicador ?? '—'}
            </Typography>
          </Box>
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
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <PictureAsPdfIcon />}
        >
          {loading ? 'Descargando...' : 'Descargar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
