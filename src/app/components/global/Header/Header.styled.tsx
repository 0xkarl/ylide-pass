import React from 'react';
import {
  styled,
  Toolbar as BaseToolbar,
  ToolbarProps,
  AppBar as BaseAppBar,
  AppBarProps,
} from '@mui/material';

export const Appbar = styled(({ ...props }: AppBarProps) => (
  <BaseAppBar {...props} />
))(({ theme }) => ({
  boxShadow: 'none',
  background: theme.palette.background.default,
}));

export const Toolbar = styled(({ ...props }: ToolbarProps) => (
  <BaseToolbar {...props} />
))(({ theme }) => ({
  alignItems: 'flex-start !important',
}));
