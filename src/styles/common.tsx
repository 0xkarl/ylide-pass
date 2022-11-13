import { styled } from '@mui/material';
import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom';

export const Link = styled(RouterLink)({
  textDecoration: 'none',
  color: 'inherit',
});

export const NavLink = styled(RouterNavLink)({
  textDecoration: 'none',
  color: 'inherit',
});
