import React, { FC } from 'react';
import { Toaster } from 'react-hot-toast';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MUIThemeProvider } from '@mui/material';

import muiTheme from '@styles/mui-theme';

import { UIProvider } from '@app/contexts/ui';
import { YlideProvider } from '@app/contexts/ylide';

import Layout from './Layout/Layout';

export const App: FC = () => {
  return (
    <MUIThemeProvider theme={muiTheme}>
      <CssBaseline />
      <UIProvider>
        <YlideProvider>
          <Layout />
          <Toaster
            toastOptions={{
              style: {
                background: 'rgba(78, 68, 206)',
                color: 'white',
                width: 'auto',
              },
              success: {
                style: {
                  background: '#3aff6f',
                  color: '#190834',
                },
              },
              error: {
                style: {
                  background: 'rgba(235, 55, 66)',
                },
              },
            }}
            position='bottom-center'
            reverseOrder={false}
          />
        </YlideProvider>
      </UIProvider>
    </MUIThemeProvider>
  );
};

export default App;
