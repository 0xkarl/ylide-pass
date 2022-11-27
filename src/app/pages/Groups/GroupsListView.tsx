import React, { FC, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd as addIcon } from '@fortawesome/free-solid-svg-icons';

import { NavLink as Link } from '@styles/common';

import { useYlide } from '@app/contexts/ylide';
import * as routes from '@app/utils/routes';

import * as S from './GroupsListView.styled';

const GroupsListView: FC = () => {
  const { groups } = useYlide();

  const groupsList = useMemo(() => Array.from(groups.entries()), [groups]);

  return (
    <S.Container>
      <div className='mb-2 font-bold flex justify-between'>
        Groups
        <Link to={routes.newGroup()}>
          <FontAwesomeIcon icon={addIcon} />
        </Link>
      </div>
      {!groupsList.length ? (
        <div className='text-sm'>No groups set.</div>
      ) : (
        <div className='flex flex-col'>
          {groupsList.map(([id, { name }]) => (
            <Link key={id} to={routes.group(id)}>
              {name}
            </Link>
          ))}
        </div>
      )}
    </S.Container>
  );
};

export default GroupsListView;
