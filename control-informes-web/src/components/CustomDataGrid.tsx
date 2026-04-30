import { DataGrid, type GridColDef, type GridRowsProp, type GridRowId } from '@mui/x-data-grid';
import { Paper } from '@mui/material';

interface CustomDataGridProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  loading?: boolean;
  pageSize?: number;
  getRowId?: (row: Record<string, unknown>) => GridRowId;
}

export default function CustomDataGrid({
  rows,
  columns,
  loading = false,
  pageSize = 10,
  getRowId,
}: CustomDataGridProps) {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', border: '1px solid rgba(145,158,171,0.12)' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={getRowId}
        initialState={{
          pagination: { paginationModel: { pageSize } },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
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
  );
}
