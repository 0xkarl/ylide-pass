import { styled, Button as BaseButton } from '@mui/material';

import { BORDER_RADIUS } from '@app/config';

export const Container = styled('div')(
  ({
    theme: {
      breakpoints,
      typography: { pxToRem },
    },
  }) => ({
    background: '#252525',
    width: '30rem',
    height: '20rem',
    padding: '1rem',
    borderRadius: pxToRem(BORDER_RADIUS),
  })
);

export const Button = styled(BaseButton)({
  backgroundColor: 'rgba(0, 233, 201, 0.08)',
  '&:hover': {
    backgroundColor: 'rgba(0, 233, 201, 0.1)',
  },
});
