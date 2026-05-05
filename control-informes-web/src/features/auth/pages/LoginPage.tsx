import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  VerifiedUser,
  BarChart,
  Security,
  SyncAlt,
} from '@mui/icons-material';
import LoginForm from '../components/LoginForm';
import { useAuthStore } from '../hooks/useAuthStore';
import { useNotificationStore } from '../../../stores/notificationStore';

const leftFeatures = [
  { icon: <BarChart sx={{ fontSize: 20 }} />, label: 'Analytics de alta precisión' },
  { icon: <Security sx={{ fontSize: 20 }} />, label: 'Protocolos de seguridad encriptada' },
  { icon: <SyncAlt sx={{ fontSize: 20 }} />, label: 'Sincronización en tiempo real' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const showNotification = useNotificationStore((s) => s.showNotification);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (data: { username: string; password: string }) => {
    clearError();
    try {
      await login(data);
      showNotification('Sesión iniciada correctamente', 'success');
    } catch {
      // error is set in the store; Alert is shown inside LoginForm
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>

      {/* ── PANEL IZQUIERDO ── */}
      {!isMobile && (
        <Box
          sx={{
            flex: '0 0 50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            px: { md: 6, lg: 10 },
            py: 8,
            background: 'linear-gradient(135deg, #1a3a6b 0%, #2563eb 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Círculos decorativos */}
          <Box sx={{
            position: 'absolute', width: 500, height: 500, borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)', top: -160, right: -180, pointerEvents: 'none',
          }} />
          <Box sx={{
            position: 'absolute', width: 340, height: 340, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)', bottom: -100, left: -120, pointerEvents: 'none',
          }} />

          {/* Ícono escudo */}
          <Box sx={{ mb: 4 }}>
            <VerifiedUser sx={{ fontSize: 56, color: '#fff' }} />
          </Box>

          {/* Título */}
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-1px', mb: 1.5 }}
          >
            Control de<br />Informes
          </Typography>

          {/* Subtítulo */}
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.75)', mb: 5, maxWidth: 340, lineHeight: 1.7 }}
          >
            Gestión de informes y publicadores de forma eficiente y centralizada.
          </Typography>

          {/* Card de features */}
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.10)',
              borderRadius: 3,
              p: 3,
              width: '100%',
              maxWidth: 380,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {leftFeatures.map((f) => (
              <Box key={f.label} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: '#fff', display: 'flex', flexShrink: 0 }}>{f.icon}</Box>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                  {f.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* ── PANEL DERECHO ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f7fa',
          px: { xs: 2, sm: 4 },
          py: { xs: 4, sm: 6 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 420,
            borderRadius: '16px',
            p: { xs: 3, sm: '40px' },
            bgcolor: '#fff',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
        </Paper>
      </Box>

    </Box>
  );
}
