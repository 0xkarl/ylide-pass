import React, { FC, useState } from 'react';
import { Menu, MenuItem, Box, Button } from '@mui/material';

import { useYlide, Account } from '@app/contexts/ylide';

const AccountSwitcher: FC = () => {
  const {
    accounts,
    activeAccount,
    setActiveAccountAddress,
    startConnectAccount,
  } = useYlide();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (currentTarget: any) => {
    setAnchorEl(currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectAccount = (account: Account) => {
    handleCloseMenu();
    setActiveAccountAddress(account.address);
  };

  return (
    <Box ml={2}>
      <Button
        variant='outlined'
        color='inherit'
        aria-haspopup='true'
        onClick={(e) => {
          !activeAccount
            ? startConnectAccount()
            : handleOpenMenu(e.currentTarget);
        }}
      >
        {!activeAccount ? <>connect</> : <>{activeAccount.address} (change)</>}
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
            {account.address}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default AccountSwitcher;
