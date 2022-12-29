import { styled } from '@mui/material';

import { BORDER_RADIUS } from '@app/config';

export const Container = styled('div')(
  ({
    theme: {
      breakpoints,
      typography: { pxToRem },
      palette,
    },
  }) => ({
    background: '#212121',
    borderTopLeftRadius: pxToRem(BORDER_RADIUS),
    borderBottomLeftRadius: pxToRem(BORDER_RADIUS),

    '.active': {
      color: palette.primary.main,
    },
  })
);

export const PrimaryLabel = styled('div')(({ theme: { breakpoints } }) => ({
  fontSize: '1.1rem',
}));

export const SecondaryLabel = styled('div')(({ theme: { breakpoints } }) => ({
  color: '#ddd',
  // fontSize: '.75rem',
}));
