import React, { FC, Fragment, useMemo } from 'react';
import { Typography } from '@mui/material';

import { StateStatus, useYlide } from '@app/contexts/ylide';
import { abbrAddr } from '@app/utils/string';

import * as S from './Connect.styled';

export const Layout: FC = () => {
  const { activeAccountAddress } = useYlide();

  return (
    <div className='flex flex-grow justify-center'>
      <S.Container>
        <div className='flex flex-col items-center'>
          <div className='mb-8 pt-4'>
            <Typography variant='h5'>YLIDE PASS</Typography>
          </div>
          <div className='mb-4'>
            <Typography variant='h6'>
              {!activeAccountAddress ? <>Connect Wallet</> : <>Setup</>}
            </Typography>
          </div>
          {!activeAccountAddress ? <Connect /> : <Setup />}
        </div>
      </S.Container>
    </div>
  );
};

export const Connect: FC = () => {
  const { wallets, addAccount, startConnectAccount } = useYlide();

  return (
    <div className='flex flex-col items-center'>
      <div className='grid grid-cols-2 gap-x-1'>
        {wallets?.map(({ factory, isAvailable }, i) => (
          <Fragment key={factory.blockchainGroup}>
            <S.Button
              key={factory.wallet}
              onClick={() =>
                isAvailable ? addAccount(factory) : startConnectAccount(i)
              }
            >
              {factory.wallet}
            </S.Button>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export const Setup: FC = () => {
  const {
    generateKey,
    publishKey,
    activeAccountState: state,
    activeAccount: account,
    activeAccountStateStatus: status,
  } = useYlide();

  const button = useMemo(() => {
    if (!(account && state)) return null;

    const { wallet, address } = account;
    const { localKey } = state;

    switch (status) {
      case StateStatus.LOCAL_KEY_DOES_NOT_MATCH_REMOTE: {
        return (
          <S.Button
            onClick={() => publishKey(wallet, address, localKey!.publicKey)}
          >
            REPLACE KEY
          </S.Button>
        );
      }

      case StateStatus.NOT_REGISTERED: {
        return (
          <S.Button
            onClick={() => publishKey(wallet, address, localKey!.publicKey)}
          >
            PUBLISH KEY
          </S.Button>
        );
      }

      case StateStatus.NOT_AVAILABLE: {
        return (
          <S.Button onClick={() => generateKey(wallet, address)}>
            GENERATE KEY
          </S.Button>
        );
      }

      default: {
        return null;
      }
    }
  }, [status, account, state, generateKey, publishKey]);

  return (
    <div className='flex flex-col items-center'>
      <div>{!account ? null : <>{abbrAddr(account.address)}</>}</div>
      <div>{account?.wallet}</div>
      <div>{button}</div>
    </div>
  );
};

export default Layout;
