import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import router from './routes';
import { GlobalSnackbar } from './components';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <GlobalSnackbar />
    </ThemeProvider>
  );
}

export default App;
