import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Alert,
  Collapse,
} from '@mui/material';
import {
  PersonOutlineRounded,
  LockOutlined,
  Visibility,
  VisibilityOff,
  LoginRounded,
} from '@mui/icons-material';

interface LoginFormInputs {
  username: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormInputs) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const schema = yup.object({
  username: yup.string().required('El usuario es requerido'),
  password: yup.string().required('La contraseña es requerida'),
});

export default function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleFormSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    await onSubmit(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      sx={{ width: '100%' }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 0.5,
            letterSpacing: '-0.5px',
          }}
        >
          Bienvenido
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ingresa tus credenciales para continuar
        </Typography>
      </Box>

      {/* Error alert */}
      <Collapse in={!!error}>
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': { fontWeight: 500 },
          }}
        >
          {error}
        </Alert>
      </Collapse>

      {/* Username */}
      <TextField
        {...register('username')}
        label="Usuario"
        fullWidth
        autoFocus
        autoComplete="username"
        error={!!errors.username}
        helperText={errors.username?.message}
        disabled={isLoading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlineRounded sx={{ color: 'primary.main', fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2.5,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            transition: 'box-shadow 0.2s',
            '&:hover': {
              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.08)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.15)',
            },
          },
        }}
      />

      {/* Password */}
      <TextField
        {...register('password')}
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isLoading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlined sx={{ color: 'primary.main', fontSize: 20 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((v) => !v)}
                edge="end"
                disabled={isLoading}
                size="small"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <VisibilityOff sx={{ fontSize: 20 }} />
                ) : (
                  <Visibility sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 4,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            transition: 'box-shadow 0.2s',
            '&:hover': {
              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.08)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.15)',
            },
          },
        }}
      />

      {/* Submit button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={!isValid || isLoading}
        startIcon={
          isLoading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <LoginRounded />
          )
        }
        sx={{
          py: 1.5,
          borderRadius: 2,
          fontWeight: 700,
          fontSize: '1rem',
          letterSpacing: '0.3px',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          boxShadow: '0 4px 16px rgba(25, 118, 210, 0.35)',
          transition: 'transform 0.15s, box-shadow 0.15s',
          '&:hover:not(:disabled)': {
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 20px rgba(25, 118, 210, 0.45)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        }}
      >
        {isLoading ? 'Iniciando sesión…' : 'Iniciar sesión'}
      </Button>
    </Box>
  );
}
