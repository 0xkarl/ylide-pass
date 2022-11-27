import React, { FC, useMemo } from 'react';

import { NavLink } from '@styles/common';

import { useYlide } from '@app/contexts/ylide';
import * as routes from '@app/utils/routes';

import * as S from './Sidebar.styled';

const Sidebar: FC = () => {
  const { groups } = useYlide();

  const groupsList = useMemo(() => Array.from(groups.entries()), [groups]);

  return (
    <S.Container className='px-4 pt-8 pb-4'>
      <div className='flex flex-col gap-y-2'>
        <div>
          <>
            <NavLink to={routes.items()}>
              <S.PrimaryLabel>Items</S.PrimaryLabel>
            </NavLink>
            <div className='pl-2 flex flex-col gap-y-1'>
              {groupsList.map(([id, { name, emoji }]) => (
                <NavLink to={routes.items(id)} key={id}>
                  <S.SecondaryLabel>
                    {emoji} {name}
                  </S.SecondaryLabel>
                </NavLink>
              ))}
            </div>
          </>
        </div>
        <div>
          <NavLink to={routes.groups()}>Groups</NavLink>
        </div>
        <div>
          <NavLink to={routes.settings()}>Settings</NavLink>
        </div>
      </div>
    </S.Container>
  );
};

export default Sidebar;
