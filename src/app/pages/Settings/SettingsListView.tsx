import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import * as routes from '@app/utils/routes';
import { toTitleCase } from '@app/utils/string';

import * as S from './SettingsListView.styled';

const SettingsListView: FC = () => {
  return (
    <S.Container>
      <div className='mb-2 font-bold flex justify-between'>Settings</div>

      <div className='flex flex-col'>
        {routes.SETTINGS_ROUTES.map((route) => (
          <Link key={route} to={routes.setting(route)}>
            {toTitleCase(route)}
          </Link>
        ))}
      </div>
    </S.Container>
  );
};

export default SettingsListView;
