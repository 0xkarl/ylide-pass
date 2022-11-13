import React, { FC, Fragment } from 'react';

import { useYlide } from '@app/contexts/ylide';

import * as S from './Connect.styled';

export const Connect: FC = () => {
  const { walletsList, addAccount } = useYlide();

  return (
    <S.Container className='flex-grow grid grid-cols-3'>
      {walletsList?.map(({ factory, isAvailable }) => (
        <Fragment key={factory.blockchainGroup}>
          <div className='flex'>{factory.wallet}</div>
          <div className='flex'>{factory.blockchainGroup}</div>
          <div className='flex'>
            {isAvailable ? (
              <button onClick={() => addAccount(factory)}>Add account</button>
            ) : (
              'Not available'
            )}
          </div>
        </Fragment>
      ))}
    </S.Container>
  );
};

export default Connect;
