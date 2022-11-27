import React, { FC, useState } from 'react';
import { Menu, MenuItem, Box, Button } from '@mui/material';

import { useYlide, Account } from '@app/contexts/ylide';
import { abbrAddr } from '@app/utils/string';

const AccountSwitcher: FC = () => {
  const {
    accounts,
    activeAccount,
    blockchain,
    setActiveAccountAddress,
    reloadLocation,
  } = useYlide();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleOpenMenu = (currentTarget: Element) => {
    setAnchorEl(currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectAccount = (account: Account) => {
    handleCloseMenu();
    setActiveAccountAddress(account.address);
    reloadLocation();
  };

  const handleAddAccount = () => {
    handleCloseMenu();
    setActiveAccountAddress(null);
  };

  return !activeAccount ? null : (
    <Box>
      <Button
        variant='outlined'
        color='inherit'
        aria-haspopup='true'
        onClick={(e) => {
          handleOpenMenu(e.currentTarget);
        }}
      >
        {abbrAddr(activeAccount.address)} ({blockchain})
      </Button>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {accounts.map((account) => (
          <MenuItem
            key={account.address}
            onClick={() => handleSelectAccount(account)}
          >
            {abbrAddr(account.address)} (
            {account.address.startsWith('0:') ? 'Everscale' : 'Fantom'})
          </MenuItem>
        ))}
        <MenuItem onClick={handleAddAccount}>Add Account</MenuItem>
      </Menu>
    </Box>
  );
};

export default AccountSwitcher;
