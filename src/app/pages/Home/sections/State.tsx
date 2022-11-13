import React, { FC, useMemo } from 'react';

import { Account, useYlide } from '@app/contexts/ylide';

import * as S from './State.styled';

export const Session: FC = () => {
  const { activeAccount } = useYlide();

  return !activeAccount ? null : <State {...activeAccount} />;
};

export const State: FC<Account> = ({ wallet, address }) => {
  const { accountsState, generateKey, publishKey } = useYlide();
  const state = useMemo(() => accountsState[address], [accountsState, address]);

  return (
    <S.Container className='flex flex-grow'>
      <div>{wallet}</div>
      <div>
        <a
          href='_blank'
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(address);
          }}
        >
          {address.substring(0, 6) +
            '...' +
            address.substring(address.length - 6)}
        </a>
      </div>
      <div>
        {state
          ? state.localKey
            ? state.remoteKey
              ? state.remoteKey.every(
                  (e, i) => state.localKey!.publicKey[i] === e
                )
                ? 'Key is registered'
                : 'Local key does not match remote'
              : 'Key is not registered'
            : 'Key is not available'
          : 'No state'}
      </div>
      <div>
        {state ? (
          state.localKey ? (
            state.remoteKey ? (
              state.remoteKey.every(
                (e, i) => state.localKey!.publicKey[i] === e
              ) ? null : (
                <button
                  onClick={() =>
                    publishKey(wallet, address, state.localKey!.publicKey)
                  }
                >
                  Replace key
                </button>
              )
            ) : (
              <button
                onClick={() =>
                  publishKey(wallet, address, state.localKey!.publicKey)
                }
              >
                Register
              </button>
            )
          ) : (
            <button onClick={() => generateKey(wallet, address)}>
              Generate
            </button>
          )
        ) : (
          'No state'
        )}
      </div>
    </S.Container>
  );
};

export default Session;
