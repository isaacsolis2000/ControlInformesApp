import { Snackbar, Alert } from '@mui/material';
import { useNotificationStore } from '../stores/notificationStore';

export default function GlobalSnackbar() {
  const { open, message, severity, hideNotification } = useNotificationStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={hideNotification}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 1 }}
    >
      <Alert
        onClose={hideNotification}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
          fontWeight: 500,
          '& .MuiAlert-icon': { fontSize: 22 },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
