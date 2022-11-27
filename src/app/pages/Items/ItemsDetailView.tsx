import React, { FC, useMemo } from 'react';
import { useParams } from 'react-router';

import { useYlide } from '@app/contexts/ylide';

import ItemForm from './components/ItemForm';
import * as S from './ItemsDetailView.styled';

const ItemsDetailView: FC = () => {
  const { items } = useYlide();
  const { id: itemId } = useParams<{ id: string }>();

  const item = useMemo(() => (!(itemId && items) ? null : items.get(itemId)), [
    items,
    itemId,
  ]);

  return (
    <S.Container>
      {!item ? (
        <div className='text-sm flex justify-center'>Unknown item.</div>
      ) : (
        <ItemForm {...{ itemId, item }} />
      )}
    </S.Container>
  );
};

export default ItemsDetailView;
