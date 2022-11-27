import React, { FC } from 'react';

import * as S from './NewItemView.styled';
import ItemForm from './components/ItemForm';

const NewItemView: FC = () => {
  return (
    <S.Container>
      <ItemForm />
    </S.Container>
  );
};

export default NewItemView;
