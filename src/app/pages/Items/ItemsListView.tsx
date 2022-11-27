import React, { FC, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd as addIcon } from '@fortawesome/free-solid-svg-icons';

import { NavLink as Link } from '@styles/common';

import { PERSONAL_GROUP_ID, useYlide } from '@app/contexts/ylide';
import * as routes from '@app/utils/routes';

import useQuery from '@app/hooks/useQuery';

import * as S from './ItemsListView.styled';

const ItemsListView: FC = () => {
  const { items, groups, activeAccountAddress } = useYlide();
  const query = useQuery();

  const itemsList = useMemo(() => {
    if (!(items && activeAccountAddress)) return null;
    const list = Array.from(items.entries());
    const groupId = query.get('group');
    if (!groupId) return list;
    const group = groups?.get(groupId);
    if (!group) return list;
    return list.filter(([_, item]) => {
      if (groupId === PERSONAL_GROUP_ID)
        return item.accounts.includes(activeAccountAddress);
      for (const account of group.accounts) {
        if (item.accounts.includes(account)) return true;
      }
      return false;
    });
  }, [items, query, groups, activeAccountAddress]);

  return (
    <S.Container className='flex flex-col'>
      <div className='mb-2 font-bold flex justify-between'>
        Items
        <Link to={routes.newItem()}>
          <FontAwesomeIcon icon={addIcon} />
        </Link>
      </div>

      {!itemsList ? (
        <div className='text-sm'>Loading items...</div>
      ) : !itemsList.length ? (
        <div className='text-sm'>No items added.</div>
      ) : (
        itemsList.map(([msgId, { name, username }]) => (
          <Link to={routes.item(msgId)} key={msgId}>
            {name} | {username}
          </Link>
        ))
      )}
    </S.Container>
  );
};

export default ItemsListView;
