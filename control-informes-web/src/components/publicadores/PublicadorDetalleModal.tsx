import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { CustomDialog } from '../index';
import { publicadoresService } from '../../services/publicadoresService';
import type { PublicadorDto } from '../../types';
import dayjs from 'dayjs';

interface Props {
  open: boolean;
  idPublicador: string | null;
  onClose: () => void;
  onEdit: (idPublicador: string) => void;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: '#637381', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: '#1a2027', mt: 0.25 }}>
        {value ?? '—'}
      </Typography>
    </Box>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="subtitle2"
      sx={{ color: '#1565c0', fontWeight: 700, mb: 1.5, mt: 0.5 }}
    >
      {children}
    </Typography>
  );
}

export default function PublicadorDetalleModal({ open, idPublicador, onClose, onEdit }: Props) {
  const [pub, setPub] = useState<PublicadorDto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !idPublicador) return;
    setLoading(true);
    setPub(null);
    publicadoresService
      .getById(idPublicador)
      .then(setPub)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, idPublicador]);

  const formatFecha = (iso?: string) =>
    iso ? dayjs(iso).format('DD/MM/YYYY') : undefined;

  return (
    <CustomDialog
      open={open}
      title="Detalle del publicador"
      onClose={onClose}
      maxWidth="sm"
      hideActions
    >
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} />
        </Box>
      )}

      {!loading && pub && (
        <Box sx={{ pb: 1 }}>
          {/* Información personal */}
          <SectionTitle>Información personal</SectionTitle>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2.5 }}>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <InfoRow label="Nombre completo" value={pub.nombreCompleto} />
            </Box>
            <InfoRow
              label="Fecha de nacimiento"
              value={formatFecha(pub.fechaNacimiento) ?? 'Sin registro'}
            />
            <InfoRow
              label="Fecha de bautismo"
              value={formatFecha(pub.fechaBautismo) ?? 'Sin bautismo'}
            />
            <InfoRow label="Género" value={pub.generoDescripcion} />
            <InfoRow label="Condición espiritual" value={pub.condicionEspiritualDescripcion} />
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          {/* Congregación */}
          <SectionTitle>Congregación</SectionTitle>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <InfoRow label="Tipo" value={pub.tipoDescripcion} />
            <InfoRow label="Rol" value={pub.rolDescripcion} />
            <InfoRow label="Grupo" value={pub.nombreGrupo || 'Sin grupo'} />
            <InfoRow
              label="Estado"
              value={
                <Chip
                  label={pub.inactivo ? 'Inactivo' : 'Activo'}
                  size="small"
                  color={pub.inactivo ? 'default' : 'success'}
                  sx={{ fontWeight: 600, mt: 0.5 }}
                />
              }
            />
            <InfoRow
              label="Fecha de creación"
              value={formatFecha(pub.fechaCreacion)}
            />
          </Box>

          {/* Acciones */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={onClose}
              sx={{ color: '#637381', borderColor: 'rgba(145,158,171,0.32)' }}
            >
              Cerrar
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => {
                onClose();
                onEdit(pub.idPublicador);
              }}
            >
              Editar
            </Button>
          </Box>
        </Box>
      )}
    </CustomDialog>
  );
}
