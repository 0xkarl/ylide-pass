import React, { FC } from 'react';

import * as S from './Header.styled';
import AccountSwitcher from './AccountSwitcher';

const Header: FC<{ mini?: boolean }> = ({ mini }) => {
  return (
    <S.Appbar position='fixed' color='inherit'>
      <S.Toolbar color='inherit' className={'pt-4'}>
        <div className='flex-grow' />
        <AccountSwitcher />
      </S.Toolbar>
    </S.Appbar>
  );
};

export default Header;
