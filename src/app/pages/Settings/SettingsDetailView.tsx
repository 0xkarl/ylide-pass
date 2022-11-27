import React, { FC } from 'react';
import { useParams } from 'react-router';

import { toTitleCase } from '@app/utils/string';

import * as S from './SettingsDetailView.styled';

const SettingsDetailView: FC = () => {
  const { route } = useParams<{ route: string }>();

  return (
    <S.Container>
      <div className='mb-2 font-bold flex justify-between'>
        {toTitleCase(route ?? '')}
      </div>
    </S.Container>
  );
};

export default SettingsDetailView;
