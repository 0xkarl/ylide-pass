import React, { FC } from 'react';

import * as S from './Header.styled';
import AccountSwitcher from './AccountSwitcher';
// import NetworkSwitcher from './NetworkSwitcher';

const Header: FC<{ mini?: boolean }> = ({ mini }) => {
  return (
    <S.Appbar position='fixed' color='inherit'>
      <S.Toolbar color='inherit' className={'pt-4 gap-x-2'}>
        <div className='flex-grow' />
        {/* <NetworkSwitcher /> */}
        <AccountSwitcher />
      </S.Toolbar>
    </S.Appbar>
  );
};

export default Header;
