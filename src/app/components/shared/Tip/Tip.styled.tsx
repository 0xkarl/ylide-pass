import React from 'react';
import {
  styled,
  Tooltip as BaseTooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material';

export const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <BaseTooltip {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: theme.typography.pxToRem(14),
    maxWidth: '25rem',
    backgroundColor: '#1a1a1a',
    color: 'white',
    borderRadius: '0.375rem',
    padding: '0.0625rem',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#7e7e7e',
  },
}));

export const Icon = styled('div')({
  height: '1rem',
  borderRadius: '100%',
  padding: '0.1rem',
  cursor: 'pointer',
});

export const DefaultIcon = styled('img')({
  height: '1rem',
  borderRadius: '100%',
  padding: '0.1rem',
  cursor: 'pointer',
});

export const Content = styled('div')({
  background: '#1a1a1a',
  borderRadius: '0.375rem',
  padding: '0.5rem 0',
});

export const ContentTitle = styled('div')({
  fontWeight: 'bold',
  fontSize: '1.25rem',
  lineHeight: '1.5rem',
  borderBottom: '0.0625rem solid #282828',
  padding: '0 1.25rem 0.25rem',
});

export const ContentBody = styled('div')({
  fontWeight: '500',
  fontSize: '0.875rem',
  lineHeight: '1rem',
  padding: '0 1.25rem 0',

  p: {
    margin: '0.25rem 0 0',
  },
});
