import React, { FC } from 'react';

import { useYlide } from '@app/contexts/ylide';

import * as S from './Manager.styled';

export const Manager: FC = () => {
  const { activeAccount } = useYlide();

  return !activeAccount ? null : <S.Container>manager</S.Container>;
};

export default Manager;
