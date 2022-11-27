import { styled } from '@mui/material';

import { BORDER_RADIUS } from '@app/config';

export const Container = styled('div')(
  ({
    theme: {
      breakpoints,
      typography: { pxToRem },
    },
  }) => ({
    background: '#252525',
    borderTopRightRadius: pxToRem(BORDER_RADIUS),
    borderBottomRightRadius: pxToRem(BORDER_RADIUS),
  })
);
