import { styled } from '@mui/material';

export const Container = styled('div')(({ theme: { breakpoints } }) => ({
  width: '75rem',
  margin: '0 auto',
  flexGrow: '1',
  paddingBottom: '1rem',
  paddingTop: '5.0625rem',

  [breakpoints.down('lg')]: {
    width: '100%',
    padding: '0 1rem',
    marginTop: '3.75rem',
  },

  [breakpoints.down('md')]: {
    // width: 'auto',
    // margin: '0 0.875rem'
  },
}));
