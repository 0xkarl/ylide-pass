import React, { FC } from 'react';

import { useYlide } from '@app/contexts/ylide';

import * as S from './Home.styled';
import Connect from './sections/Connect';
import Session from './sections/State';
import Manager from './sections/Manager';

export const Home: FC = () => {
  const { accounts } = useYlide();

  return (
    <S.Container className='flex flex-grow'>
      {!accounts.length ? (
        <Connect />
      ) : (
        <>
          <Session />
          <Manager />
        </>
      )}
    </S.Container>
  );
};

export default Home;
