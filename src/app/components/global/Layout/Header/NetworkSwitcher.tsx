import React, { FC, useState } from 'react';
import { Menu, MenuItem, Box, Button } from '@mui/material';
import { EVMNetwork } from '@ylide/ethereum';

import { useYlide, NETWORKS } from '@app/contexts/ylide';
import { toTitleCase } from '@app/utils/string';

const NETWORK_LIST = Array.from(NETWORKS.entries());

const NetworkSwitcher: FC = () => {
  const { blockchain, setNetwork } = useYlide();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleOpenMenu = (currentTarget: Element) => {
    setAnchorEl(currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectNetwork = (network: EVMNetwork) => {
    handleCloseMenu();
    setNetwork(network);
  };

  return (
    <Box>
      <Button
        variant='outlined'
        color='inherit'
        aria-haspopup='true'
        onClick={(e) => {
          handleOpenMenu(e.currentTarget);
        }}
      >
        network: {toTitleCase(blockchain)}
      </Button>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {NETWORK_LIST.map(([network, blockchain]) => (
          <MenuItem key={network} onClick={() => handleSelectNetwork(network)}>
            {toTitleCase(blockchain)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default NetworkSwitcher;
