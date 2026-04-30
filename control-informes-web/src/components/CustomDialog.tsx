import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Box, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ReactNode } from 'react';

interface CustomDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
  children: ReactNode;
  hideActions?: boolean;
}

export default function CustomDialog({
  open,
  title,
  onClose,
  onSubmit,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  loading = false,
  maxWidth = 'sm',
  children,
  hideActions = false,
}: CustomDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title}
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: '#637381',
              bgcolor: 'rgba(99,115,129,0.08)',
              '&:hover': { bgcolor: 'rgba(99,115,129,0.16)' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>{children}</DialogContent>
      {!hideActions && (
        <>
          <Divider />
          <DialogActions>
            <Button onClick={onClose} disabled={loading} variant="outlined" color="inherit" sx={{ color: '#637381', borderColor: 'rgba(145,158,171,0.32)' }}>
              {cancelText}
            </Button>
            {onSubmit && (
              <Button onClick={onSubmit} variant="contained" disabled={loading}>
                {submitText}
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
