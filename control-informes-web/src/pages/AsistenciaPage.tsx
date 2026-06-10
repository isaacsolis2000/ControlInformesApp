import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  IconButton,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  CircularProgress,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import dayjs from 'dayjs';
import { ConfirmDialog, CustomSelect } from '../components';
import TarjetaReunionesModal from '../components/asistencia/TarjetaReunionesModal';
import { asistenciaService } from '../services/asistenciaService';
import type { ImportarPlantillaResult } from '../services/asistenciaService';
import { useNotificationStore } from '../stores/notificationStore';
import type {
  AsistenciaDto,
  RegistrarAsistenciaDto,
  ActualizarAsistenciaDto,
  RegistrarFechaDto,
  FiltrosAsistenciaListado,
} from '../types';
import { TipoReunion } from '../types';

// ─── constantes ───────────────────────────────────────────────────────────────

const currentYear = new Date().getFullYear();
const PAGE_SIZE = 15;

const ANOS_OPTIONS = Array.from({ length: 5 }, (_, i) => ({
  value: currentYear - i,
  label: `${currentYear - i}`,
}));

const MESES_OPTIONS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

const TIPO_REUNION_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: String(TipoReunion.Publica), label: 'Pública' },
  { value: String(TipoReunion.EntreSemana), label: 'Entre Semana' },
];

const TIPO_REUNION_FORM = [
  { value: TipoReunion.Publica, label: 'Pública' },
  { value: TipoReunion.EntreSemana, label: 'Entre Semana' },
];

const TIPO_LABEL: Record<number, string> = {
  [TipoReunion.Publica]: 'Pública',
  [TipoReunion.EntreSemana]: 'Entre Semana',
};

// ─── tipos locales ────────────────────────────────────────────────────────────

interface ReunionFormState {
  fechaReunion: string;
  tipoReunion: TipoReunion;
  cantidadPresencial: number;
  cantidadVirtual: number;
  observacion: string;
}

interface FechaFormState {
  fechaReunion: string;
  observacion: string;
}

const emptyReunionForm: ReunionFormState = {
  fechaReunion: dayjs().format('YYYY-MM-DD'),
  tipoReunion: TipoReunion.Publica,
  cantidadPresencial: 0,
  cantidadVirtual: 0,
  observacion: '',
};

const emptyFechaForm: FechaFormState = {
  fechaReunion: dayjs().format('YYYY-MM-DD'),
  observacion: '',
};

// ─── componente ───────────────────────────────────────────────────────────────

export default function AsistenciaPage() {
  const showNotification = useNotificationStore((s) => s.showNotification);

  // listado
  const [rows, setRows] = useState<AsistenciaDto[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [loading, setLoading] = useState(false);

  // filtros
  const [filtroAno, setFiltroAno] = useState(currentYear);
  const [filtroMes, setFiltroMes] = useState(new Date().getMonth() + 1);
  const [filtroTipo, setFiltroTipo] = useState('');

  // modal registrar reunión
  const [reunionOpen, setReunionOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reunionForm, setReunionForm] = useState<ReunionFormState>(emptyReunionForm);
  const [saving, setSaving] = useState(false);

  // modal registrar fecha (bitácora)
  const [fechaOpen, setFechaOpen] = useState(false);
  const [fechaForm, setFechaForm] = useState<FechaFormState>(emptyFechaForm);
  const [savingFecha, setSavingFecha] = useState(false);

  // eliminar
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // tarjeta reuniones
  const [tarjetaOpen, setTarjetaOpen] = useState(false);

  // importar plantilla
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── fetch ──────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    const filtros: FiltrosAsistenciaListado = {
      ano: filtroAno,
      mes: filtroMes,
      pagina: page + 1,
      tamanoPagina: PAGE_SIZE,
      ...(filtroTipo !== '' && { tipoReunion: Number(filtroTipo) as TipoReunion }),
    };
    try {
      const result = await asistenciaService.getListado(filtros);
      setRows(result.items);
      setTotalRows(result.totalRegistros);
    } catch { /* handled by interceptor */ }
    finally { setLoading(false); }
  }, [filtroAno, filtroMes, filtroTipo]);

  useEffect(() => {
    setPagina(0);
    fetchData(0);
  }, [fetchData]);

  // ─── handlers reunión ────────────────────────────────────────────────────────

  const handleOpenCreate = () => {
    setEditingId(null);
    setReunionForm(emptyReunionForm);
    setReunionOpen(true);
  };

  const handleOpenEdit = async (row: AsistenciaDto) => {
    setEditingId(row.idAsistencia);
    setReunionForm({
      fechaReunion: row.fechaReunion.split('T')[0],
      tipoReunion: row.tipoReunion ?? TipoReunion.Publica,
      cantidadPresencial: row.cantidadPresencial,
      cantidadVirtual: row.cantidadVirtual,
      observacion: row.observacion ?? '',
    });
    setReunionOpen(true);
  };

  const handleSaveReunion = async () => {
    if (!reunionForm.fechaReunion) {
      showNotification('La fecha es requerida', 'warning');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const dto: ActualizarAsistenciaDto = {
          idAsistencia: editingId,
          fechaReunion: reunionForm.fechaReunion,
          tipoReunion: reunionForm.tipoReunion,
          cantidadPresencial: reunionForm.cantidadPresencial,
          cantidadVirtual: reunionForm.cantidadVirtual,
          observacion: reunionForm.observacion || undefined,
        };
        await asistenciaService.actualizar(dto);
        showNotification('Reunión actualizada', 'success');
      } else {
        const dto: RegistrarAsistenciaDto = {
          fechaReunion: reunionForm.fechaReunion,
          tipoReunion: reunionForm.tipoReunion,
          cantidadPresencial: reunionForm.cantidadPresencial,
          cantidadVirtual: reunionForm.cantidadVirtual,
          observacion: reunionForm.observacion || undefined,
        };
        await asistenciaService.registrar(dto);
        showNotification('Reunión registrada', 'success');
      }
      setReunionOpen(false);
      fetchData(pagina);
    } catch { /* handled by interceptor */ }
    finally { setSaving(false); }
  };

  // ─── handlers fecha ──────────────────────────────────────────────────────────

  const handleSaveFecha = async () => {
    if (!fechaForm.fechaReunion) {
      showNotification('La fecha es requerida', 'warning');
      return;
    }
    setSavingFecha(true);
    try {
      const dto: RegistrarFechaDto = {
        fechaReunion: fechaForm.fechaReunion,
        observacion: fechaForm.observacion || undefined,
      };
      await asistenciaService.registrarFecha(dto);
      showNotification('Fecha registrada en bitácora', 'success');
      setFechaOpen(false);
      fetchData(pagina);
    } catch { /* handled by interceptor */ }
    finally { setSavingFecha(false); }
  };

  // ─── handlers eliminar ───────────────────────────────────────────────────────

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await asistenciaService.eliminar(deletingId);
      showNotification('Registro eliminado', 'success');
      setDeleteOpen(false);
      fetchData(pagina);
    } catch { /* handled by interceptor */ }
    finally { setDeleting(false); }
  };

  // ─── handlers plantilla ──────────────────────────────────────────────────────

  const handleDescargarPlantilla = async () => {
    try {
      await asistenciaService.descargarPlantilla();
    } catch { /* handled by interceptor */ }
  };

  const handleImportarPlantilla = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setImportLoading(true);
    try {
      const result: ImportarPlantillaResult = await asistenciaService.importarPlantilla(file);
      const errCount = result.errores?.length ?? 0;
      if (errCount > 0) {
        showNotification(
          `Insertados: ${result.insertados} | Actualizados: ${result.actualizados} | Errores: ${errCount} — ${result.errores!.join('; ')}`,
          'warning',
        );
      } else {
        showNotification(
          `Importación completada — Insertados: ${result.insertados} | Actualizados: ${result.actualizados}`,
          'success',
        );
      }
      fetchData(pagina);
    } catch { /* handled by interceptor */ }
    finally { setImportLoading(false); }
  };

  // ─── total calculado ─────────────────────────────────────────────────────────

  const totalForm = reunionForm.cantidadPresencial + reunionForm.cantidadVirtual;

  // ─── columnas ────────────────────────────────────────────────────────────────

  const columns: GridColDef<AsistenciaDto>[] = [
    {
      field: 'fechaReunion',
      headerName: 'Fecha',
      width: 120,
      valueFormatter: (value: string) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      field: 'tipoReunion',
      headerName: 'Tipo',
      width: 140,
      renderCell: (p) =>
        p.value != null ? (
          <Chip
            label={TIPO_LABEL[p.value as number] ?? p.value}
            size="small"
            color={p.value === TipoReunion.Publica ? 'primary' : 'info'}
            sx={{ fontWeight: 600 }}
          />
        ) : (
          <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
            Sin reunión
          </Typography>
        ),
    },
    {
      field: 'cantidadPresencial',
      headerName: 'Presencial',
      width: 110,
      type: 'number',
      renderCell: (p) =>
        p.row.tipoReunion != null ? (
          <Typography variant="body2">{p.value}</Typography>
        ) : (
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>—</Typography>
        ),
    },
    {
      field: 'cantidadVirtual',
      headerName: 'Virtual',
      width: 100,
      type: 'number',
      renderCell: (p) =>
        p.row.tipoReunion != null ? (
          <Typography variant="body2">{p.value}</Typography>
        ) : (
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>—</Typography>
        ),
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 90,
      type: 'number',
      renderCell: (p) =>
        p.row.tipoReunion != null ? (
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.value}</Typography>
        ) : (
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>—</Typography>
        ),
    },
    {
      field: 'observacion',
      headerName: 'Observación',
      flex: 1,
      minWidth: 160,
      renderCell: (p) => (
        <Typography variant="body2" sx={{ color: '#637381' }}>
          {p.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 100,
      sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => handleOpenEdit(p.row)}
              sx={{ color: '#1976d2', bgcolor: 'rgba(25,118,210,0.08)', '&:hover': { bgcolor: 'rgba(25,118,210,0.16)' } }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              onClick={() => { setDeletingId(p.row.idAsistencia); setDeleteOpen(true); }}
              sx={{ color: '#c62828', bgcolor: 'rgba(198,40,40,0.08)', '&:hover': { bgcolor: 'rgba(198,40,40,0.16)' } }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // ─── render ──────────────────────────────────────────────────────────────────

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: 2.5,
              background: 'linear-gradient(135deg, #01579b, #0288d1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(2,136,209,0.25)',
            }}
          >
            <EventIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ color: '#1a2027' }}>Reuniones</Typography>
            <Typography variant="body2" sx={{ color: '#637381' }}>{totalRows} registro{totalRows !== 1 ? 's' : ''}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => setTarjetaOpen(true)}
            sx={{ borderRadius: 2.5 }}
          >
            Descargar Tarjeta
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDescargarPlantilla}
            sx={{ borderRadius: 2.5 }}
          >
            Descargar Plantilla
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            style={{ display: 'none' }}
            onChange={handleImportarPlantilla}
          />
          <Button
            variant="outlined"
            startIcon={importLoading ? <CircularProgress size={16} /> : <UploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={importLoading}
            sx={{ borderRadius: 2.5 }}
          >
            Importar Plantilla
          </Button>
          <Button
            variant="outlined"
            startIcon={<EventNoteIcon />}
            onClick={() => { setFechaForm(emptyFechaForm); setFechaOpen(true); }}
            sx={{ borderRadius: 2.5 }}
          >
            Registrar Fecha
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ borderRadius: 2.5 }}
          >
            Registrar Reunión
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Paper elevation={0} sx={{ p: 2, mb: 2.5, border: '1px solid rgba(145,158,171,0.12)', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ width: 140 }}>
          <CustomSelect label="Año" value={filtroAno} options={ANOS_OPTIONS} onChange={(v) => setFiltroAno(v as number)} />
        </Box>
        <Box sx={{ width: 165 }}>
          <CustomSelect label="Mes" value={filtroMes} options={MESES_OPTIONS} onChange={(v) => setFiltroMes(v as number)} />
        </Box>
        <Box sx={{ width: 170 }}>
          <CustomSelect
            label="Tipo de reunión"
            value={filtroTipo}
            options={TIPO_REUNION_OPTIONS}
            onChange={(v) => setFiltroTipo(v as string)}
          />
        </Box>
      </Paper>

      {/* Tabla paginada */}
      <Paper elevation={0} sx={{ border: '1px solid rgba(145,158,171,0.12)' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(r) => r.idAsistencia}
          rowCount={totalRows}
          paginationMode="server"
          paginationModel={{ page: pagina, pageSize: PAGE_SIZE }}
          onPaginationModelChange={(m) => { setPagina(m.page); fetchData(m.page); }}
          pageSizeOptions={[PAGE_SIZE]}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#e8f0fe', borderBottom: '2px solid #c5d8fc' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#1565c0' },
            '& .MuiDataGrid-row': { transition: 'background-color 0.15s', '&:hover': { backgroundColor: 'rgba(25,118,210,0.035)' } },
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f3f8', fontSize: '0.875rem' },
            '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #f0f3f8', backgroundColor: '#fafbff' },
          }}
        />
      </Paper>

      {/* ── MODAL REGISTRAR / EDITAR REUNIÓN ─────────────────────────────────── */}
      <Dialog open={reunionOpen} onClose={() => setReunionOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {editingId ? 'Editar Reunión' : 'Registrar Reunión'}
            </Typography>
            <IconButton size="small" onClick={() => setReunionOpen(false)} sx={{ color: '#637381' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
            <TextField
              label="Fecha de reunión"
              type="date"
              value={reunionForm.fechaReunion}
              onChange={(e) => setReunionForm({ ...reunionForm, fechaReunion: e.target.value })}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <CustomSelect
              label="Tipo de reunión"
              value={reunionForm.tipoReunion}
              options={TIPO_REUNION_FORM}
              onChange={(v) => setReunionForm({ ...reunionForm, tipoReunion: v as TipoReunion })}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Presencial"
                  type="number"
                  value={reunionForm.cantidadPresencial}
                  onChange={(e) => setReunionForm({ ...reunionForm, cantidadPresencial: Math.max(0, Number(e.target.value)) })}
                  fullWidth
                  size="small"
                  slotProps={{ htmlInput: { min: 0 } }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Virtual"
                  type="number"
                  value={reunionForm.cantidadVirtual}
                  onChange={(e) => setReunionForm({ ...reunionForm, cantidadVirtual: Math.max(0, Number(e.target.value)) })}
                  fullWidth
                  size="small"
                  slotProps={{ htmlInput: { min: 0 } }}
                />
              </Grid>
            </Grid>
            <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#e8f0fe', borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#1565c0' }}>Total calculado</Typography>
              <Typography variant="h5" sx={{ color: '#1565c0', fontWeight: 700 }}>{totalForm}</Typography>
            </Paper>
            <TextField
              label="Observación (opcional)"
              value={reunionForm.observacion}
              onChange={(e) => setReunionForm({ ...reunionForm, observacion: e.target.value })}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setReunionOpen(false)} disabled={saving} variant="outlined" color="inherit" sx={{ color: '#637381', borderColor: 'rgba(145,158,171,0.32)' }}>
            Cancelar
          </Button>
          <Button onClick={handleSaveReunion} variant="contained" disabled={saving}>
            {editingId ? 'Actualizar' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── MODAL REGISTRAR FECHA (bitácora) ─────────────────────────────────── */}
      <Dialog open={fechaOpen} onClose={() => setFechaOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventNoteIcon sx={{ color: '#0288d1' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Registrar Fecha</Typography>
            </Box>
            <IconButton size="small" onClick={() => setFechaOpen(false)} sx={{ color: '#637381' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
            <Typography variant="body2" sx={{ color: '#637381' }}>
              Registra solo la fecha en la bitácora sin datos de asistencia.
            </Typography>
            <TextField
              label="Fecha de reunión"
              type="date"
              value={fechaForm.fechaReunion}
              onChange={(e) => setFechaForm({ ...fechaForm, fechaReunion: e.target.value })}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Observación (opcional)"
              value={fechaForm.observacion}
              onChange={(e) => setFechaForm({ ...fechaForm, observacion: e.target.value })}
              fullWidth
              size="small"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setFechaOpen(false)} disabled={savingFecha} variant="outlined" color="inherit" sx={{ color: '#637381', borderColor: 'rgba(145,158,171,0.32)' }}>
            Cancelar
          </Button>
          <Button onClick={handleSaveFecha} variant="contained" disabled={savingFecha}>
            Registrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── CONFIRM ELIMINAR ─────────────────────────────────────────────────── */}
      <ConfirmDialog
        open={deleteOpen}
        message="¿Está seguro de eliminar este registro de reunión?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
        confirmText="Eliminar"
        loading={deleting}
      />

      {/* ── MODAL TARJETA REUNIONES ───────────────────────────────────────────── */}
      <TarjetaReunionesModal
        open={tarjetaOpen}
        onClose={() => setTarjetaOpen(false)}
      />
    </Box>
  );
}
