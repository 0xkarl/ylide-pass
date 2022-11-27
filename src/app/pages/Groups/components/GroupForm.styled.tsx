import { styled, TextField } from '@mui/material';

import { BORDER_RADIUS } from '@app/config';

export const Container = styled('div')(({ theme: { breakpoints } }) => ({}));

export const Tags = styled('div')(({ theme: { breakpoints } }) => ({
  margin: '0 0.2rem 0 0',
}));

export const Tag = styled('div')(
  ({
    theme: {
      breakpoints,
      typography: { pxToRem },
    },
  }) => ({
    background: 'rgb(67, 67, 67)',
    borderRadius: pxToRem(BORDER_RADIUS),
    padding: '0.25rem 0.5rem',
  })
);

export const AccountsTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: '0.25rem',
  },
});
