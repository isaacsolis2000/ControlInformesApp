import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { grupoService } from '../services/grupoService';
import { useNotificationStore } from '../stores/notificationStore';
import ConfirmDialog from '../components/ConfirmDialog';
import GrupoFormModal from '../components/grupos/GrupoFormModal';
import AsignarPublicadoresModal from '../components/grupos/AsignarPublicadoresModal';
import QuitarMiembrosModal from '../components/grupos/QuitarMiembrosModal';
import type { GrupoDto } from '../types';

export default function GruposPage() {
  const showNotification = useNotificationStore((s) => s.showNotification);

  const [grupos, setGrupos] = useState<GrupoDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<GrupoDto | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [asignarOpen, setAsignarOpen] = useState(false);
  const [asignarGrupo, setAsignarGrupo] = useState<GrupoDto | null>(null);

  const [miembrosOpen, setMiembrosOpen] = useState(false);
  const [miembrosGrupo, setMiembrosGrupo] = useState<GrupoDto | null>(null);

  const fetchGrupos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await grupoService.getAll();
      setGrupos(data);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrupos();
  }, [fetchGrupos]);

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await grupoService.eliminar(deletingId);
      showNotification('Grupo eliminado', 'success');
      setDeleteOpen(false);
      fetchGrupos();
    } catch {
      // handled by interceptor
    } finally {
      setDeleting(false);
    }
  };

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
            <GroupsIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ color: '#1a2027' }}>
              Grupos
            </Typography>
            <Typography variant="body2" sx={{ color: '#637381' }}>
              {grupos.length} grupo{grupos.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingGrupo(null);
            setFormOpen(true);
          }}
          sx={{ borderRadius: 2.5 }}
        >
          Nuevo Grupo
        </Button>
      </Box>

      {/* Tabla */}
      <Paper elevation={0} sx={{ border: '1px solid rgba(145,158,171,0.12)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : grupos.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <GroupsIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
            <Typography variant="body1" sx={{ color: '#94a3b8' }}>
              No hay grupos registrados
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#e8f0fe' }}>
                  {[
                    { label: 'Nombre', align: 'left' },
                    { label: 'Capitán', align: 'left' },
                    { label: 'Total Miembros', align: 'center' },
                    { label: 'Acciones', align: 'right' },
                  ].map(({ label, align }) => (
                    <TableCell
                      key={label}
                      align={align as 'left' | 'center' | 'right'}
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#1565c0',
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {grupos.map((g) => (
                  <TableRow key={g.idGrupo} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{g.nombre}</TableCell>
                    <TableCell sx={{ color: '#637381' }}>{g.nombreCapitan}</TableCell>
                    <TableCell align="center">
                      {g.totalMiembros !== undefined ? (
                        <Chip
                          icon={<PeopleIcon sx={{ fontSize: '14px !important' }} />}
                          label={g.totalMiembros}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(25,118,210,0.08)',
                            color: '#1565c0',
                            fontWeight: 600,
                          }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="Ver miembros">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setMiembrosGrupo(g);
                              setMiembrosOpen(true);
                            }}
                            sx={{
                              color: '#6a1b9a',
                              bgcolor: 'rgba(106,27,154,0.08)',
                              '&:hover': { bgcolor: 'rgba(106,27,154,0.16)' },
                            }}
                          >
                            <ManageAccountsIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Asignar publicadores">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setAsignarGrupo(g);
                              setAsignarOpen(true);
                            }}
                            sx={{
                              color: '#2e7d32',
                              bgcolor: 'rgba(46,125,50,0.08)',
                              '&:hover': { bgcolor: 'rgba(46,125,50,0.16)' },
                            }}
                          >
                            <PersonAddIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingGrupo(g);
                              setFormOpen(true);
                            }}
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
                              setDeletingId(g.idGrupo);
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Modal crear/editar */}
      <GrupoFormModal
        open={formOpen}
        grupo={editingGrupo}
        onClose={() => setFormOpen(false)}
        onSuccess={() => {
          setFormOpen(false);
          fetchGrupos();
        }}
      />

      {/* Modal asignar publicadores */}
      <AsignarPublicadoresModal
        open={asignarOpen}
        idGrupo={asignarGrupo?.idGrupo ?? ''}
        nombreGrupo={asignarGrupo?.nombre}
        onClose={() => setAsignarOpen(false)}
        onSuccess={() => {
          setAsignarOpen(false);
          fetchGrupos();
        }}
      />

      {/* Modal ver/quitar miembros */}
      <QuitarMiembrosModal
        open={miembrosOpen}
        idGrupo={miembrosGrupo?.idGrupo ?? ''}
        nombreGrupo={miembrosGrupo?.nombre}
        onClose={() => setMiembrosOpen(false)}
        onSuccess={() => {
          setMiembrosOpen(false);
          fetchGrupos();
        }}
      />

      {/* Confirmar eliminar */}
      <ConfirmDialog
        open={deleteOpen}
        message="¿Está seguro de eliminar este grupo? Los publicadores asignados quedarán sin grupo."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
        confirmText="Eliminar"
        loading={deleting}
      />
    </Box>
  );
}
