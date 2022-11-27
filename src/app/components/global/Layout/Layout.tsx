import React, { FC, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { useYlide } from '@app/contexts/ylide';

import * as S from './Layout.styled';
import Header from './Header/Header';
import Connect from './Connect';
import Sidebar from './Sidebar';
import ListView from './ListView';
import DetailView from './DetailView';

const Layout: FC = () => {
  const { appIsReady, isAddingAccount } = useYlide();

  useEffect(() => {
    if (appIsReady) {
      document.getElementById('boot-loader')!.classList.add('hidden');
    }
  }, [appIsReady]);

  return (
    <>
      <Header />
      <S.Container>
        {!appIsReady ? null : isAddingAccount ? (
          <Connect />
        ) : (
          <S.Layout>
            <Router>
              <Sidebar />
              <ListView />
              <DetailView />
            </Router>
          </S.Layout>
        )}
      </S.Container>
    </>
  );
};

export default Layout;
