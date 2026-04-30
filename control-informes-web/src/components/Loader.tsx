import { Box, CircularProgress, Typography } from '@mui/material';

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export default function Loader({ fullScreen = false, message }: LoaderProps) {
  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          bgcolor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
        }}
      >
        <CircularProgress size={48} thickness={4} />
        {message && (
          <Typography variant="body2" color="text.secondary">{message}</Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1.5, py: 6 }}>
      <CircularProgress size={40} thickness={4} />
      {message && (
        <Typography variant="body2" color="text.secondary">{message}</Typography>
      )}
    </Box>
  );
}
