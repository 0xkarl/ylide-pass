import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import * as routes from '@app/utils/routes';
import Items from '@app/pages/Items/ItemsListView';
import Groups from '@app/pages/Groups/GroupsListView';
import Settings from '@app/pages/Settings/SettingsListView';

import * as S from './ListView.styled';

const ListView: FC = () => {
  return (
    <S.Container className='px-4 pt-8 pb-4'>
      <Routes>
        <Route path={routes.ITEMS} element={<Items />} />
        <Route path={routes.GROUPS} element={<Groups />} />
        <Route path={routes.SETTINGS} element={<Settings />} />
      </Routes>
    </S.Container>
  );
};

export default ListView;
