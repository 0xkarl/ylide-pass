import { styled } from '@mui/material';

export const Container = styled('div')(
  ({ theme: { breakpoints, palette } }) => ({
    '.active': {
      color: palette.primary.main,
    },
  })
);
