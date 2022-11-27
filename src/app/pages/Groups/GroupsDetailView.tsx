import React, { FC, useMemo } from 'react';
import { useParams } from 'react-router';

import { useYlide } from '@app/contexts/ylide';

import GroupForm from './components/GroupForm';
import * as S from './GroupsDetailView.styled';

const GroupsDetailView: FC = () => {
  const { groups } = useYlide();
  const { id: groupId } = useParams<{ id: string }>();

  const group = useMemo(() => (!groupId ? null : groups.get(groupId)), [
    groups,
    groupId,
  ]);

  return (
    <S.Container>
      {!group ? (
        <div className='text-sm flex justify-center'>Unknown group.</div>
      ) : (
        <GroupForm {...{ groupId, group }} />
      )}
    </S.Container>
  );
};

export default GroupsDetailView;
