import type { ImportResult } from '../types';
import { apiPostFormData, apiGetBlob } from './apiClient';

export const excelService = {
  importar: (file: File, ano: number, mes: number) => {
    const formData = new FormData();
    formData.append('archivo', file);
    return apiPostFormData<ImportResult>(`/excel/importar-informes?ano=${ano}&mes=${mes}`, formData);
  },
  descargarTemplate: async () => {
    const blob = await apiGetBlob('/excel/template');
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template_informes.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
  },
};
