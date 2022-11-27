import { createTheme } from '@mui/material';

// import { BORDER_RADIUS } from '@app/config';

const theme = createTheme({
  typography: {
    fontFamily: ['IBM Plex Sans', 'Helvetica', 'Arial', 'sans-serif'].join(','),
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e9c9',
    },
    secondary: {
      main: '#fc0',
    },
    error: {
      main: '#6b0808',
    },
    background: {
      default: '#111111',
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
