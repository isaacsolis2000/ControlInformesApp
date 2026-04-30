import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Chip,
  IconButton,
  TextField,
  FormControlLabel,
  Switch,
  InputAdornment,
  Paper,
} from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BadgeIcon from '@mui/icons-material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';
import { CustomDataGrid, CustomDialog, ConfirmDialog, CustomSelect } from '../components';
import { publicadoresService } from '../services/publicadoresService';
import { useNotificationStore } from '../stores/notificationStore';
import type { Publicador, TipoPublicador } from '../types';

const TIPOS_PUBLICADOR = [
  { value: 'Publicador', label: 'Publicador' },
  { value: 'PrecursorAuxiliar', label: 'Precursor Auxiliar' },
  { value: 'PrecursorRegular', label: 'Precursor Regular' },
];

const tipoLabel: Record<string, string> = {
  Publicador: 'Publicador',
  PrecursorAuxiliar: 'Precursor Auxiliar',
  PrecursorRegular: 'Precursor Regular',
};

const tipoColor: Record<string, 'primary' | 'info' | 'default'> = {
  PrecursorRegular: 'primary',
  PrecursorAuxiliar: 'info',
  Publicador: 'default',
};

interface PublicadorFormState {
  NombreCompleto: string;
  FechaNacimiento: string;
  FechaBautismo: string;
  Tipo: TipoPublicador;
  Activo: boolean;
}

const emptyForm: PublicadorFormState = {
  NombreCompleto: '',
  FechaNacimiento: '',
  FechaBautismo: '',
  Tipo: 'Publicador',
  Activo: true,
};

export default function PublicadoresPage() {
  const navigate = useNavigate();
  const showNotification = useNotificationStore((s) => s.showNotification);

  const [publicadores, setPublicadores] = useState<Publicador[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PublicadorFormState>(emptyForm);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await publicadoresService.getAll();
      setPublicadores(data);
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRows = publicadores.filter((p) =>
    p.nombreCompleto.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpenModal(true);
  };

  const handleOpenEdit = (pub: Publicador) => {
    setEditingId(pub.idPublicador);
    setForm({
      NombreCompleto: pub.nombreCompleto,
      FechaNacimiento: pub.fechaNacimiento.split('T')[0],
      FechaBautismo: pub.fechaBautismo ? pub.fechaBautismo.split('T')[0] : '',
      Tipo: pub.tipo,
      Activo: pub.activo,
    });
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    if (!form.NombreCompleto.trim()) {
      showNotification('El nombre es requerido', 'warning');
      return;
    }
    if (!form.FechaNacimiento) {
      showNotification('La fecha de nacimiento es requerida', 'warning');
      return;
    }
    try {
      if (editingId) {
        await publicadoresService.update(editingId, {
          idPublicador: editingId,
          nombreCompleto: form.NombreCompleto,
          fechaNacimiento: form.FechaNacimiento,
          fechaBautismo: form.FechaBautismo || null,
          tipo: form.Tipo,
          activo: form.Activo,
        });
        showNotification('Publicador actualizado', 'success');
      } else {
        await publicadoresService.create({
          nombreCompleto: form.NombreCompleto,
          fechaNacimiento: form.FechaNacimiento,
          fechaBautismo: form.FechaBautismo || null,
          tipo: form.Tipo,
        });
        showNotification('Publicador creado', 'success');
      }
      setOpenModal(false);
      fetchData();
    } catch {
      // Error handled by interceptor
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await publicadoresService.delete(deletingId);
      showNotification('Publicador eliminado', 'success');
      setDeleteDialogOpen(false);
      fetchData();
    } catch {
      // Error handled by interceptor
    }
  };

  const columns: GridColDef[] = [
    { field: 'nombreCompleto', headerName: 'Nombre', flex: 1, minWidth: 200 },
    {
      field: 'tipo',
      headerName: 'Tipo',
      width: 180,
      renderCell: (params) => (
        <Chip
          label={tipoLabel[params.value as string] ?? params.value}
          size="small"
          color={tipoColor[params.value as string] ?? 'default'}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'activo',
      headerName: 'Estado',
      width: 110,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Activo' : 'Inactivo'}
          size="small"
          color={params.value ? 'success' : 'default'}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => navigate(`/publicadores/${params.row.idPublicador}/tarjeta`)}
            title="Ver tarjeta"
            sx={{
              color: '#0288d1',
              bgcolor: 'rgba(2,136,209,0.08)',
              '&:hover': { bgcolor: 'rgba(2,136,209,0.16)' },
            }}
          >
            <BadgeIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleOpenEdit(params.row as Publicador)}
            title="Editar"
            sx={{
              color: '#1976d2',
              bgcolor: 'rgba(25,118,210,0.08)',
              '&:hover': { bgcolor: 'rgba(25,118,210,0.16)' },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              setDeletingId(params.row.idPublicador as string);
              setDeleteDialogOpen(true);
            }}
            title="Eliminar"
            sx={{
              color: '#c62828',
              bgcolor: 'rgba(198,40,40,0.08)',
              '&:hover': { bgcolor: 'rgba(198,40,40,0.16)' },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #1565c0, #1976d2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(25,118,210,0.25)',
            }}
          >
            <PeopleIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ color: '#1a2027' }}>
              Publicadores
            </Typography>
            <Typography variant="body2" sx={{ color: '#637381' }}>
              {publicadores.length} publicador{publicadores.length !== 1 ? 'es' : ''} registrado
              {publicadores.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ borderRadius: 2.5 }}
        >
          Nuevo Publicador
        </Button>
      </Box>

      {/* Search bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2.5,
          border: '1px solid rgba(145,158,171,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <TextField
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ maxWidth: 320 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <Typography variant="caption" sx={{ color: '#94a3b8', ml: 'auto' }}>
          {filteredRows.length} resultado{filteredRows.length !== 1 ? 's' : ''}
        </Typography>
      </Paper>

      <CustomDataGrid
        rows={filteredRows}
        columns={columns}
        loading={loading}
        getRowId={(row) => (row as unknown as Publicador).idPublicador}
      />

      {/* Modal Crear/Editar */}
      <CustomDialog
        open={openModal}
        title={editingId ? 'Editar Publicador' : 'Nuevo Publicador'}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        submitText={editingId ? 'Actualizar' : 'Crear'}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
          <TextField
            label="Nombre completo"
            value={form.NombreCompleto}
            onChange={(e) => setForm({ ...form, NombreCompleto: e.target.value })}
            fullWidth
            autoFocus
            placeholder="Ej. Juan Pérez"
          />
          <TextField
            label="Fecha de nacimiento"
            type="date"
            value={form.FechaNacimiento}
            onChange={(e) => setForm({ ...form, FechaNacimiento: e.target.value })}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Fecha de bautismo (opcional)"
            type="date"
            value={form.FechaBautismo}
            onChange={(e) => setForm({ ...form, FechaBautismo: e.target.value })}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <CustomSelect
            label="Tipo de publicador"
            value={form.Tipo}
            options={TIPOS_PUBLICADOR}
            onChange={(val) => setForm({ ...form, Tipo: val as TipoPublicador })}
          />
          {editingId && (
            <FormControlLabel
              control={
                <Switch
                  checked={form.Activo}
                  onChange={(e) => setForm({ ...form, Activo: e.target.checked })}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Publicador activo
                </Typography>
              }
            />
          )}
        </Box>
      </CustomDialog>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={deleteDialogOpen}
        message="¿Está seguro de eliminar este publicador? Esta acción no se puede deshacer."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Eliminar"
      />
    </Box>
  );
}

