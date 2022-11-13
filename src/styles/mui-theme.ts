import { createTheme } from '@mui/material';

// const BORDER_RADIUS = 5

const theme = createTheme({
  typography: {
    fontFamily: ['Fira Code', 'Helvetica', 'Arial', 'sans-serif'].join(','),
  },
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgba(159, 27, 188, 0.45)',
    },
    secondary: {
      main: '#00e9c9',
    },
    error: {
      main: '#6b0808',
    },
  },
  // overrides: {
  //   MuiButton: {
  //     root: {
  //       borderRadius: BORDER_RADIUS,
  //     },
  //   },
  //   MuiPaper: {
  //     rounded: {
  //       borderRadius: BORDER_RADIUS,
  //     },
  //   },
  //   MuiDialog: {
  //     paper: {
  //       borderRadius: BORDER_RADIUS,
  //     },
  //   },
  //   MuiInput: {
  //     underline: {
  //       '&:before': {
  //         borderBottomColor: '#313131',
  //       },
  //       '&:after': {
  //         borderBottomColor: '#313131',
  //       },
  //     },
  //   },
  // },

  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: 600,
  //     md: 900,
  //     lg: 1200,
  //     xl: 1536,
  //     mobile: 0,
  //     tablet: 640,
  //     laptop: 1024,
  //     desktop: 1200,
  //   },
  // },
});

export default theme;
