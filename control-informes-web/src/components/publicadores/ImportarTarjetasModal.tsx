import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { publicadoresService } from '../../services/publicadoresService';
import { grupoService } from '../../services/grupoService';
import type { GrupoDto, ResultadoImportacionTarjetasDto } from '../../types';
import { useNotificationStore } from '../../stores/notificationStore';

interface Props {
  open: boolean;
  onClose: () => void;
  onImportado: () => void;
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ImportarTarjetasModal({ open, onClose, onImportado }: Props) {
  const [paso, setPaso] = useState<1 | 2>(1);
  const [archivos, setArchivos] = useState<File[]>([]);
  const [idGrupo, setIdGrupo] = useState('');
  const [grupos, setGrupos] = useState<GrupoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ResultadoImportacionTarjetasDto | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const showNotification = useNotificationStore((s) => s.showNotification);

  useEffect(() => {
    if (!open) return;
    grupoService.getAll().then(setGrupos).catch(() => {});
  }, [open]);

  const resetState = () => {
    setPaso(1);
    setArchivos([]);
    setIdGrupo('');
    setResultado(null);
  };

  const handleClose = () => {
    if (paso === 2) onImportado();
    onClose();
    setTimeout(resetState, 300);
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevos = Array.from(e.target.files ?? []).filter((f) => f.name.toLowerCase().endsWith('.pdf'));
    setArchivos((prev) => {
      const nombres = new Set(prev.map((f) => f.name));
      return [...prev, ...nuevos.filter((f) => !nombres.has(f.name))];
    });
    if (inputRef.current) inputRef.current.value = '';
  };

  const quitarArchivo = (nombre: string) => {
    setArchivos((prev) => prev.filter((f) => f.name !== nombre));
  };

  const handleImportar = async () => {
    if (archivos.length === 0) {
      showNotification('Debe seleccionar al menos un archivo PDF', 'warning');
      return;
    }
    setLoading(true);
    try {
      const res = await publicadoresService.importarTarjetas(archivos, idGrupo || undefined);
      setResultado(res);
      setPaso(2);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const grupoOptions = [
    { value: '', label: 'Sin grupo' },
    ...grupos.map((g) => ({ value: g.idGrupo, label: g.nombre })),
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        {paso === 1 ? 'Importar tarjetas PDF' : 'Resultado de importación'}
      </DialogTitle>

      <DialogContent sx={{ pt: '12px !important' }}>
        {/* ── PASO 1: selección ── */}
        {paso === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Grupo (opcional)</InputLabel>
              <Select
                value={idGrupo}
                label="Grupo (opcional)"
                onChange={(e) => setIdGrupo(e.target.value)}
              >
                {grupoOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={handleFilesChange}
              />
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={() => inputRef.current?.click()}
                fullWidth
                sx={{ py: 1.5, borderStyle: 'dashed' }}
              >
                Seleccionar archivos PDF
              </Button>
            </Box>

            {archivos.length > 20 && (
              <Alert severity="warning" sx={{ py: 0.5 }}>
                Se seleccionaron {archivos.length} archivos. Se recomienda importar en lotes de máximo 20.
              </Alert>
            )}

            {archivos.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={`${archivos.length} archivo${archivos.length !== 1 ? 's' : ''} seleccionado${archivos.length !== 1 ? 's' : ''}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}

            {archivos.length > 0 ? (
              <Box
                sx={{
                  maxHeight: 240,
                  overflowY: 'auto',
                  border: '1px solid rgba(145,158,171,0.2)',
                  borderRadius: 1.5,
                }}
              >
                <List dense disablePadding>
                  {archivos.map((archivo) => (
                    <ListItem
                      key={archivo.name}
                      divider
                      secondaryAction={
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => quitarArchivo(archivo.name)}
                          sx={{ color: '#c62828' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body2" noWrap sx={{ maxWidth: 360, color: '#1a2027' }}>
                            {archivo.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: '#637381' }}>
                            {formatBytes(archivo.size)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', py: 1 }}>
                No hay archivos seleccionados
              </Typography>
            )}
          </Box>
        )}

        {/* ── PASO 2: resultados ── */}
        {paso === 2 && resultado && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="success" icon={<CheckCircleIcon />}>
              <Typography variant="subtitle2">
                {resultado.exitosos} publicador{resultado.exitosos !== 1 ? 'es' : ''} procesado
                {resultado.exitosos !== 1 ? 's' : ''} correctamente
              </Typography>
            </Alert>

            {resultado.creados.length > 0 && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: '#637381', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}
                >
                  Creados ({resultado.creados.length})
                </Typography>
                <Box sx={{ mt: 0.75, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {resultado.creados.map((nombre) => (
                    <Chip key={nombre} label={nombre} size="small" color="success" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}

            {resultado.actualizados.length > 0 && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: '#637381', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}
                >
                  Actualizados ({resultado.actualizados.length})
                </Typography>
                <Box sx={{ mt: 0.75, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {resultado.actualizados.map((nombre) => (
                    <Chip key={nombre} label={nombre} size="small" color="info" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}

            {resultado.errores.length > 0 && (
              <Alert severity="error" icon={<ErrorIcon />}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {resultado.fallidos} fallo{resultado.fallidos !== 1 ? 's' : ''}
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  {resultado.errores.map((err, i) => (
                    <li key={i}>
                      <Typography variant="caption">{err}</Typography>
                    </li>
                  ))}
                </Box>
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        {paso === 1 && (
          <>
            <Button onClick={handleClose} color="inherit" sx={{ color: '#637381' }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleImportar}
              disabled={loading || archivos.length === 0}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <UploadFileIcon />}
            >
              {loading ? 'Importando...' : 'Importar'}
            </Button>
          </>
        )}
        {paso === 2 && (
          <Button variant="contained" onClick={handleClose}>
            Cerrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
