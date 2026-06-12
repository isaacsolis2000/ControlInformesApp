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
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import { publicadoresService } from '../../services/publicadoresService';
import { useNotificationStore } from '../../stores/notificationStore';

interface Props {
  open: boolean;
  onClose: () => void;
  grupo: { idGrupo: string; nombre: string; totalMiembros?: number } | null;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{ color: '#637381', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: '#1a2027', mt: 0.25 }}>
        {value ?? '—'}
      </Typography>
    </Box>
  );
}

export default function DescargarTarjetasGrupoModal({ open, onClose, grupo }: Props) {
  const [anoSeleccionado, setAnoSeleccionado] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const showNotification = useNotificationStore((s) => s.showNotification);

  const sinMiembros = (grupo?.totalMiembros ?? 0) === 0;

  const handleDescargar = async () => {
    if (!grupo) return;
    setLoading(true);
    try {
      await publicadoresService.descargarTarjetasPorGrupo(
        grupo.idGrupo,
        anoSeleccionado,
        grupo.nombre,
      );
      onClose();
    } catch {
      showNotification('Error al descargar las tarjetas del grupo', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Descargar tarjetas del grupo</DialogTitle>
      <DialogContent sx={{ pt: '12px !important' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <InfoRow label="Grupo" value={grupo?.nombre} />
            </Box>
            <InfoRow
              label="Total miembros"
              value={
                grupo?.totalMiembros !== undefined
                  ? `${grupo.totalMiembros} publicador${grupo.totalMiembros !== 1 ? 'es' : ''}`
                  : '—'
              }
            />
          </Box>

          <TextField
            label="Año de servicio"
            type="number"
            size="small"
            fullWidth
            value={anoSeleccionado}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v > 1900) setAnoSeleccionado(v);
            }}
            slotProps={{ htmlInput: { min: 1900, step: 1 } }}
          />

          <Alert severity="info" sx={{ py: 0.5 }}>
            Se descargará un PDF por cada publicador del grupo en un archivo ZIP.
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit" sx={{ color: '#637381' }}>
          Cancelar
        </Button>
        <Tooltip
          title={sinMiembros ? 'Este grupo no tiene publicadores asignados' : ''}
          disableHoverListener={!sinMiembros}
        >
          <span>
            <Button
              variant="contained"
              onClick={handleDescargar}
              disabled={loading || sinMiembros}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FolderZipIcon />}
            >
              {loading ? 'Descargando...' : 'Descargar ZIP'}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
