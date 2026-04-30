import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AssignmentOutlined,
  BarChartRounded,
  GroupsRounded,
  ChecklistRounded,
} from '@mui/icons-material';
import LoginForm from '../components/LoginForm';
import { useAuthStore } from '../hooks/useAuthStore';
import { useNotificationStore } from '../../../stores/notificationStore';

const features = [
  { icon: <AssignmentOutlined />, label: 'Gestión de informes' },
  { icon: <GroupsRounded />, label: 'Control de publicadores' },
  { icon: <BarChartRounded />, label: 'Reportes y estadísticas' },
  { icon: <ChecklistRounded />, label: 'Registro de asistencia' },
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: '#f0f4ff',
      }}
    >
      {/* ── LEFT BRANDING PANEL ── */}
      {!isMobile && (
        <Box
          sx={{
            flex: '0 0 48%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            px: { md: 6, lg: 10 },
            py: 8,
            background: 'linear-gradient(145deg, #0d47a1 0%, #1565c0 40%, #1976d2 70%, #42a5f5 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles */}
          <Box
            sx={{
              position: 'absolute',
              width: 480,
              height: 480,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              top: -120,
              right: -160,
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 320,
              height: 320,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              bottom: -80,
              left: -100,
              pointerEvents: 'none',
            }}
          />

          {/* Brand icon */}
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <AssignmentOutlined sx={{ fontSize: 38, color: '#fff' }} />
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.15,
              letterSpacing: '-1px',
              mb: 1.5,
            }}
          >
            Control de
            <br />
            Informes
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.80)',
              mb: 5,
              maxWidth: 320,
              lineHeight: 1.6,
            }}
          >
            Gestión de informes y publicadores de forma eficiente y centralizada.
          </Typography>

          {/* Feature list */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {features.map((f) => (
              <Box
                key={f.label}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {f.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Bottom tag */}
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              bottom: 28,
              left: { md: 48, lg: 80 },
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.5px',
            }}
          >
            © {new Date().getFullYear()} Control de Informes
          </Typography>
        </Box>
      )}

      {/* ── RIGHT FORM PANEL ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 4 },
          py: { xs: 4, sm: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile-only header */}
          {isMobile && (
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 4px 16px rgba(25,118,210,0.3)',
                }}
              >
                <AssignmentOutlined sx={{ fontSize: 30, color: '#fff' }} />
              </Box>
              <Typography variant="h6" fontWeight={700} color="primary.dark">
                Control de Informes
              </Typography>
            </Box>
          )}

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              boxShadow: '0 8px 40px rgba(13, 71, 161, 0.10)',
              border: '1px solid rgba(25,118,210,0.08)',
              bgcolor: '#fff',
            }}
          >
            <LoginForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </Paper>

          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            mt={3}
            color="text.disabled"
          >
            Sistema de gestión interno · Acceso restringido
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
