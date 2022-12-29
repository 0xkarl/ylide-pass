import React, { FC } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import * as routes from '@app/utils/routes';

import * as S from './SettingsDetailView.styled';

const General: FC = () => (
  <S.ItemContainer className='flex flex-col'>
    <div className='mb-2 font-bold flex justify-between'>General</div>
    <div></div>
  </S.ItemContainer>
);

const Appearance: FC = () => (
  <S.ItemContainer className='flex flex-col'>
    <div className='mb-2 font-bold flex justify-between'>Appearance</div>
    <div></div>
  </S.ItemContainer>
);

const Security: FC = () => (
  <S.ItemContainer className='flex flex-col'>
    <div className='mb-2 font-bold flex justify-between'>Security</div>
    <div></div>
  </S.ItemContainer>
);

const COMPONENTS = [General, Appearance, Security];

const SettingsDetailView: FC = () => {
  return (
    <S.Container>
      <div className='mb-2 font-bold flex justify-between'>
        <Routes>
          {routes.SETTINGS_ROUTES.map((route, i) => {
            const Component = COMPONENTS[i];
            return (
              <Route key={route} path={`/${route}`} element={<Component />} />
            );
          })}
          <Route
            path={'*'}
            element={
              <Navigate to={routes.setting(routes.SETTINGS_ROUTES[0])} />
            }
          />
        </Routes>
      </div>
    </S.Container>
  );
};

export default SettingsDetailView;
