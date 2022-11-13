import React, { lazy, FC } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import Header from './Header/Header';
import * as S from './Layout.styled';

const Home = lazy(() => import('@app/pages/Home/Home'));

const Layout: FC = () => {
  return (
    <>
      <Header />
      <S.Container>
        <Router>
          <Routes>
            <Route path={'/'} element={<Home />} />
          </Routes>
        </Router>
      </S.Container>
    </>
  );
};

export default Layout;
