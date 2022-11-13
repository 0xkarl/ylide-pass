import React, { FC, ReactNode } from 'react';
import { Breakpoint } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material';

type MediaProps = {
  children: ReactNode;
  className?: string;
};

export const Media: FC<{
  up?: Breakpoint;
  down?: Breakpoint;
  between?: Breakpoint[];
  only?: Breakpoint;
  children: ReactNode;
}> = ({ up, down, between, only, children }) => {
  const matches = useMediaQuery((theme: Theme) => {
    if (up) {
      return theme.breakpoints.up(up);
    }
    if (down) {
      return theme.breakpoints.down(down);
    }
    if (between) {
      return theme.breakpoints.between(between[0]!, between[1]!);
    }
    if (only) {
      return theme.breakpoints.only(only);
    }
    return '';
  });
  return !matches ? null : <>{children}</>;
};

export const DesktopOnlyView: FC<MediaProps> = ({ children }) => (
  <Media up='md'>{children}</Media>
);

export const MobileOrTabletView: FC<MediaProps> = ({ children, className }) => (
  <Media down='md'>{children}</Media>
);

export const TabletOnlyView: FC<MediaProps> = ({ children }) => (
  <Media only={'sm'}>{children}</Media>
);

export const MobileHiddenView: FC<MediaProps> = ({ children, className }) => (
  <Media up='xs'>{children}</Media>
);

export const MobileOnlyView: FC<MediaProps> = ({ children, className }) => (
  <Media only='xs'>{children}</Media>
);
