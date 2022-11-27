import { styled } from '@mui/material';

export const Container = styled('div')(({ theme: { breakpoints } }) => ({
  background: '#252525',
  borderLeft: '0.0625rem solid rgba(255, 255, 255, 0.05)',
  borderRight: '0.0625rem solid rgba(255, 255, 255, 0.05)',
}));
