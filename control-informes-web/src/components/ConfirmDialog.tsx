import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title = 'Confirmar acción',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'rgba(245,124,0,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <WarningAmberIcon sx={{ color: '#f57c00', fontSize: 20 }} />
          </Box>
          {title}
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6 }}>
          {message}
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          onClick={onCancel}
          disabled={loading}
          variant="outlined"
          color="inherit"
          sx={{ color: '#637381', borderColor: 'rgba(145,158,171,0.32)' }}
        >
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={loading}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
