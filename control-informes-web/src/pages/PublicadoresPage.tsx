import { useState, useEffect, useCallback } from 'react';
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
  Tooltip,
  Checkbox,
} from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BadgeIcon from '@mui/icons-material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';

import DownloadIcon from '@mui/icons-material/Download';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { CustomDialog, ConfirmDialog, CustomSelect } from '../components';

import { publicadoresService } from '../services/publicadoresService';
import { grupoService } from '../services/grupoService';
import { excelService } from '../services/excelService';
import { useNotificationStore } from '../stores/notificationStore';
import type {
  PublicadorDto,
  PublicadorGrupoDto,
  GrupoDto,
  CrearPublicadorDto,
  ActualizarPublicadorDto,
  FiltroPublicadorGrupoDto,
  AsignarPublicadoresDto,
} from '../types';
import { TipoPublicador } from '../types';

const PAGE_SIZE = 15;

const TIPO_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: String(TipoPublicador.Publicador), label: 'Publicador' },
  { value: String(TipoPublicador.NoBautizado), label: 'No Bautizado' },
  { value: String(TipoPublicador.PrecursorAuxiliar), label: 'Precursor Auxiliar' },
  { value: String(TipoPublicador.PrecursorRegular), label: 'Precursor Regular' },
];

const TIPO_LABEL: Record<number, string> = {
  [TipoPublicador.Publicador]: 'Publicador',
  [TipoPublicador.NoBautizado]: 'No Bautizado',
  [TipoPublicador.PrecursorAuxiliar]: 'Precursor Auxiliar',
  [TipoPublicador.PrecursorRegular]: 'Precursor Regular',
};

const TIPO_COLOR: Record<number, 'default' | 'primary' | 'info' | 'warning'> = {
  [TipoPublicador.Publicador]: 'default',
  [TipoPublicador.NoBautizado]: 'warning',
  [TipoPublicador.PrecursorAuxiliar]: 'info',
  [TipoPublicador.PrecursorRegular]: 'primary',
};

interface FormState {
  nombreCompleto: string;
  fechaNacimiento: string;
  fechaBautismo: string;
  tipo: TipoPublicador;
  inactivo: boolean;
  idGrupo: string;
}

const emptyForm: FormState = {
  nombreCompleto: '',
  fechaNacimiento: '',
  fechaBautismo: '',
  tipo: TipoPublicador.Publicador,
  inactivo: false,
  idGrupo: '',
};

export default function PublicadoresPage() {
  const navigate = useNavigate();
  const showNotification = useNotificationStore((s) => s.showNotification);

  // Datos paginados
  const [rows, setRows] = useState<PublicadorGrupoDto[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [idGrupo, setIdGrupo] = useState('');
  const [tipo, setTipo] = useState('');
  const [soloInactivos, setSoloInactivos] = useState(false);

  // Grupos para el selector de filtro
  const [grupos, setGrupos] = useState<GrupoDto[]>([]);

  // CRUD modal
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingGrupoActual, setEditingGrupoActual] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchGrupos = useCallback(async () => {
    try {
      const data = await grupoService.getAll();
      setGrupos(data);
    } catch {
      // handled by interceptor
    }
  }, []);

  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true);
      const filtros: FiltroPublicadorGrupoDto = {
        pagina: page + 1,
        tamanoPagina: PAGE_SIZE,
        ...(nombreCompleto.trim() && { nombreCompleto: nombreCompleto.trim() }),
        ...(idGrupo && { idGrupo }),
        ...(tipo !== '' && { tipo: Number(tipo) as TipoPublicador }),
        ...(soloInactivos && { inactivo: true }),
      };
      try {
        const result = await publicadoresService.getListado(filtros);
        setRows(result.items);
        setTotal(result.totalRegistros);
      } catch {
        // handled by interceptor
      } finally {
        setLoading(false);
      }
    },
    [nombreCompleto, idGrupo, tipo, soloInactivos],
  );

  useEffect(() => {
    fetchGrupos();
  }, [fetchGrupos]);

  useEffect(() => {
    setPagina(0);
    fetchData(0);
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setEditingGrupoActual('');
    setForm(emptyForm);
    setOpenModal(true);
  };

  const handleOpenEdit = (pub: PublicadorGrupoDto) => {
    setEditingId(pub.idPublicador);
    const grupoActual = pub.idGrupo ?? '';
    setEditingGrupoActual(grupoActual);
    publicadoresService.getById(pub.idPublicador).then((dto: PublicadorDto) => {
      setForm({
        nombreCompleto: dto.nombreCompleto,
        fechaNacimiento: dto.fechaNacimiento ? dto.fechaNacimiento.split('T')[0] : '',
        fechaBautismo: dto.fechaBautismo ? dto.fechaBautismo.split('T')[0] : '',
        tipo: dto.tipo,
        inactivo: dto.inactivo,
        idGrupo: grupoActual,
      });
      setOpenModal(true);
    });
  };

  const handleSubmit = async () => {
    if (!form.nombreCompleto.trim()) {
      showNotification('El nombre es requerido', 'warning');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const dto: ActualizarPublicadorDto = {
          idPublicador: editingId,
          nombreCompleto: form.nombreCompleto,
          fechaNacimiento: form.fechaNacimiento || undefined,
          fechaBautismo: form.fechaBautismo || undefined,
          tipo: form.tipo,
          idGrupo: form.idGrupo || undefined,
          inactivo: form.inactivo,
        };
        await publicadoresService.actualizar(editingId, dto);
        showNotification('Publicador actualizado', 'success');
      } else {
        const dto: CrearPublicadorDto = {
          nombreCompleto: form.nombreCompleto,
          fechaNacimiento: form.fechaNacimiento || undefined,
          fechaBautismo: form.fechaBautismo || undefined,
          tipo: form.tipo,
        };
        const newId = await publicadoresService.crear(dto);
        if (form.idGrupo && newId) {
          const asignarDto: AsignarPublicadoresDto = {
            idGrupo: form.idGrupo,
            idPublicadores: [newId],
          };
          await grupoService.asignarPublicadores(asignarDto);
        }
        showNotification('Publicador creado', 'success');
      }
      setOpenModal(false);
      fetchData(pagina);
    } catch {
      // handled by interceptor
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await publicadoresService.eliminar(deletingId);
      showNotification('Publicador eliminado', 'success');
      setDeleteOpen(false);
      fetchData(pagina);
    } catch {
      // handled by interceptor
    } finally {
      setDeleting(false);
    }
  };

  const handleDescargarExcel = async () => {
    try {
      await excelService.descargarListadoPublicadores();
    } catch {
      // handled by interceptor
    }
  };

  const grupoOptions = [
    { value: '', label: 'Todos los grupos' },
    ...grupos.map((g) => ({ value: g.idGrupo, label: g.nombre })),
  ];

  const grupoFormOptions = [
    { value: '', label: 'Sin grupo' },
    ...grupos.map((g) => ({ value: g.idGrupo, label: g.nombre })),
  ];

  const columns: GridColDef<PublicadorGrupoDto>[] = [
    {
      field: 'nombrePublicador',
      headerName: 'Nombre',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      width: 180,
      renderCell: (params) => (
        <Chip
          label={TIPO_LABEL[params.value as number] ?? params.value}
          size="small"
          color={TIPO_COLOR[params.value as number] ?? 'default'}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'nombreGrupo',
      headerName: 'Grupo',
      width: 160,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: params.value ? '#1a2027' : '#94a3b8' }}>
          {params.value || 'Sin grupo'}
        </Typography>
      ),
    },
    {
      field: 'esCapitan',
      headerName: 'Capitán',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) =>
        params.value ? (
          <Tooltip title="Capitán del grupo">
            <StarIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
          </Tooltip>
        ) : null,
    },
    {
      field: 'inactivo',
      headerName: 'Estado',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Inactivo' : 'Activo'}
          size="small"
          color={params.value ? 'default' : 'success'}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Ver tarjeta">
            <IconButton
              size="small"
              onClick={() => navigate(`/publicadores/${params.row.idPublicador}/tarjeta`)}
              sx={{
                color: '#0288d1',
                bgcolor: 'rgba(2,136,209,0.08)',
                '&:hover': { bgcolor: 'rgba(2,136,209,0.16)' },
              }}
            >
              <BadgeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => handleOpenEdit(params.row)}
              sx={{
                color: '#1976d2',
                bgcolor: 'rgba(25,118,210,0.08)',
                '&:hover': { bgcolor: 'rgba(25,118,210,0.16)' },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              onClick={() => {
                setDeletingId(params.row.idPublicador);
                setDeleteOpen(true);
              }}
              sx={{
                color: '#c62828',
                bgcolor: 'rgba(198,40,40,0.08)',
                '&:hover': { bgcolor: 'rgba(198,40,40,0.16)' },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
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
              {total} registro{total !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDescargarExcel}
            sx={{ borderRadius: 2.5 }}
          >
            Descargar Excel
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ borderRadius: 2.5 }}
          >
            Nuevo Publicador
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2.5,
          border: '1px solid rgba(145,158,171,0.12)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <TextField
          placeholder="Buscar por nombre..."
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          size="small"
          sx={{ minWidth: 240 }}
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
        <Box sx={{ minWidth: 180 }}>
          <CustomSelect
            label="Grupo"
            value={idGrupo}
            options={grupoOptions}
            onChange={(v) => setIdGrupo(v as string)}
            size="small"
          />
        </Box>
        <Box sx={{ minWidth: 180 }}>
          <CustomSelect
            label="Tipo"
            value={tipo}
            options={TIPO_OPTIONS}
            onChange={(v) => setTipo(v as string)}
            size="small"
          />
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={soloInactivos}
              onChange={(e) => setSoloInactivos(e.target.checked)}
              size="small"
            />
          }
          label={<Typography variant="body2">Solo inactivos</Typography>}
        />
      </Paper>

      {/* Tabla paginada */}
      <Paper sx={{ width: '100%', border: '1px solid rgba(145,158,171,0.12)' }} elevation={0}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.idPublicador}
          rowCount={total}
          paginationMode="server"
          paginationModel={{ page: pagina, pageSize: PAGE_SIZE }}
          onPaginationModelChange={(model) => {
            setPagina(model.page);
            fetchData(model.page);
          }}
          pageSizeOptions={[PAGE_SIZE]}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#e8f0fe',
              borderBottom: '2px solid #c5d8fc',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#1565c0',
            },
            '& .MuiDataGrid-row': {
              transition: 'background-color 0.15s',
              '&:hover': { backgroundColor: 'rgba(25,118,210,0.035)' },
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f3f8',
              fontSize: '0.875rem',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #f0f3f8',
              backgroundColor: '#fafbff',
            },
          }}
        />
      </Paper>

      {/* Modal Crear/Editar */}
      <CustomDialog
        open={openModal}
        title={editingId ? 'Editar Publicador' : 'Nuevo Publicador'}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        submitText={editingId ? 'Actualizar' : 'Crear'}
        loading={saving}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
          <TextField
            label="Nombre completo"
            value={form.nombreCompleto}
            onChange={(e) => setForm({ ...form, nombreCompleto: e.target.value })}
            fullWidth
            autoFocus
            placeholder="Ej. Juan Pérez"
          />
          <TextField
            label="Fecha de nacimiento"
            type="date"
            value={form.fechaNacimiento}
            onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Fecha de bautismo (opcional)"
            type="date"
            value={form.fechaBautismo}
            onChange={(e) => setForm({ ...form, fechaBautismo: e.target.value })}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <CustomSelect
            label="Tipo de publicador"
            value={form.tipo}
            options={TIPO_OPTIONS.filter((o) => o.value !== '')}
            onChange={(val) => setForm({ ...form, tipo: Number(val) as TipoPublicador })}
          />
          <CustomSelect
            label="Grupo"
            value={form.idGrupo}
            options={grupoFormOptions}
            onChange={(val) => setForm({ ...form, idGrupo: val as string })}
            disabled={!!editingId && editingGrupoActual !== ''}
          />
          {editingId && (
            <FormControlLabel
              control={
                <Switch
                  checked={form.inactivo}
                  onChange={(e) => setForm({ ...form, inactivo: e.target.checked })}
                  color="warning"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Marcar como inactivo
                </Typography>
              }
            />
          )}
        </Box>
      </CustomDialog>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={deleteOpen}
        message="¿Está seguro de eliminar este publicador? Esta acción no se puede deshacer."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
        confirmText="Eliminar"
        loading={deleting}
      />

    </Box>
  );
}
