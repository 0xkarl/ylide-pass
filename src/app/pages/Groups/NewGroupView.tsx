import React, { FC } from 'react';

import * as S from './NewGroupView.styled';
import GroupForm from './components/GroupForm';

const NewGroupView: FC = () => {
  return (
    <S.Container>
      <GroupForm />
    </S.Container>
  );
};

export default NewGroupView;
