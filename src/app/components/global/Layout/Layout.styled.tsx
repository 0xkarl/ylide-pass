import { styled } from '@mui/material';

const TOP_PADDING = 6;
const BOTTOM_PADDING = 1;

export const Container = styled('div')(({ theme: { breakpoints } }) => ({
  display: 'flex',
  flex: 1,
  height: `calc(100vh - ${BOTTOM_PADDING}rem)`,
  margin: '0 auto 0',
  paddingTop: `${TOP_PADDING}rem`,
  paddingBottom: `${BOTTOM_PADDING}rem`,
  width: '75rem',
  flexGrow: '1',
  borderRadius: '0.5rem',

  // [breakpoints.down('lg')]: {
  //   width: '100%',
  //   padding: '0 1rem',
  //   marginTop: '3.75rem',
  // },

  // [breakpoints.down('md')]: {
  //   // width: 'auto',
  //   // margin: '0 0.875rem'
  // },
}));

export const Layout = styled('div')(({ theme: { breakpoints } }) => ({
  display: 'grid',
  gridTemplateColumns: '12rem 20rem 2fr',
  flex: 1,
}));
