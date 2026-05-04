import type { ResultadoImportacionDto } from '../types';
import { apiPostFormData, apiGetBlob } from './apiClient';

async function descargarBlob(blob: Blob, filename: string): Promise<void> {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export const excelService = {
  importarInformes: (file: File, ano: number, mes: number, idGrupo: string) => {
    const formData = new FormData();
    formData.append('archivo', file);
    return apiPostFormData<ResultadoImportacionDto>(
      `/excel/importar-informes?ano=${ano}&mes=${mes}&idGrupo=${idGrupo}`,
      formData
    );
  },

  descargarTemplate: async (idGrupo: string) => {
    const blob = await apiGetBlob(`/excel/template/${idGrupo}`);
    await descargarBlob(blob, 'template_informes.xlsx');
  },

  descargarListadoPublicadores: async () => {
    const blob = await apiGetBlob('/excel/listado-publicadores');
    await descargarBlob(blob, 'listado_publicadores.xlsx');
  },

  descargarListadoGrupos: async () => {
    const blob = await apiGetBlob('/excel/listado-grupos');
    await descargarBlob(blob, 'listado_grupos.xlsx');
  },
};
