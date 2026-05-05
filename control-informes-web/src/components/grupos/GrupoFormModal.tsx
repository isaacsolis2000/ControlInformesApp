import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  Divider,
  TextField,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import { publicadoresService } from '../../services/publicadoresService';
import { grupoService } from '../../services/grupoService';
import { useNotificationStore } from '../../stores/notificationStore';
import CustomSelect from '../CustomSelect';
import type { GrupoDto, CrearGrupoDto, ActualizarGrupoDto, PublicadorDto } from '../../types';

interface Props {
  open: boolean;
  grupo?: GrupoDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  idGrupo: string;
  nombre: string;
  idCapitan: string;
}

const emptyForm: FormState = { idGrupo: '', nombre: '', idCapitan: '' };

export default function GrupoFormModal({ open, grupo, onClose, onSuccess }: Props) {
  const showNotification = useNotificationStore((s) => s.showNotification);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [publicadores, setPublicadores] = useState<PublicadorDto[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchPublicadores = useCallback(async () => {
    try {
      const data = await publicadoresService.getAll();
      setPublicadores(data);
    } catch {
      // handled by interceptor
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    fetchPublicadores();
    setForm(grupo ? { idGrupo: grupo.idGrupo, nombre: grupo.nombre, idCapitan: grupo.idCapitan } : emptyForm);
  }, [open, grupo, fetchPublicadores]);

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      showNotification('El nombre es requerido', 'warning');
      return;
    }
    if (!form.idCapitan) {
      showNotification('El capitán es requerido', 'warning');
      return;
    }
    setSaving(true);
    try {
      if (grupo) {
        const dto: ActualizarGrupoDto = {idGrupo: form.idGrupo, nombre: form.nombre, idCapitan: form.idCapitan };
        await grupoService.actualizar(dto);
        showNotification('Grupo actualizado', 'success');
      } else {
        const dto: CrearGrupoDto = { nombre: form.nombre, idCapitan: form.idCapitan };
        await grupoService.crear(dto);
        showNotification('Grupo creado', 'success');
      }
      onSuccess();
    } catch {
      // handled by interceptor
    } finally {
      setSaving(false);
    }
  };

  const capitanOptions = [
    { value: '', label: 'Seleccionar capitán...' },
    ...publicadores.map((p) => ({ value: p.idPublicador, label: p.nombreCompleto })),
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                background: 'linear-gradient(135deg, #1565c0, #1976d2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GroupIcon sx={{ color: '#fff', fontSize: 16 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {grupo ? 'Editar Grupo' : 'Nuevo Grupo'}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} disabled={saving} sx={{ color: '#637381' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
          <TextField
            label="Nombre del grupo"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            fullWidth
            autoFocus
            placeholder="Ej. Grupo 1"
          />
          <CustomSelect
            label="Capitán"
            value={form.idCapitan}
            options={capitanOptions}
            onChange={(val) => setForm({ ...form, idCapitan: val as string })}
          />
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          disabled={saving}
          variant="outlined"
          color="inherit"
          sx={{ color: '#637381', borderColor: 'rgba(145,158,171,0.32)' }}
        >
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving} sx={{ minWidth: 100 }}>
          {saving && <CircularProgress size={14} sx={{ mr: 1, color: 'inherit' }} />}
          {grupo ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
