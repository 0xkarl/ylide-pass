import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import * as routes from '@app/utils/routes';
import NewItem from '@app/pages/Items/NewItemView';
import NewGroup from '@app/pages/Groups/NewGroupView';
import Item from '@app/pages/Items/ItemsDetailView';
import Group from '@app/pages/Groups/GroupsDetailView';
import Setting from '@app/pages/Settings/SettingsDetailView';

import * as S from './DetailView.styled';

const DetailView: FC = () => {
  return (
    <S.Container className='px-4 pt-8 pb-4'>
      <Routes>
        <Route path={routes.NEW_ITEM} element={<NewItem />} />
        <Route path={routes.NEW_GROUP} element={<NewGroup />} />
        <Route path={routes.ITEM} element={<Item />} />
        <Route path={routes.GROUP} element={<Group />} />
        <Route path={routes.SETTING} element={<Setting />} />
        <Route
          path='*'
          element={<div className='flex justify-center'>No item selected.</div>}
        />
      </Routes>
    </S.Container>
  );
};

export default DetailView;
