import React, { FC, useState, MouseEvent, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import {
  FormControl,
  Input,
  InputLabel,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import * as routes from '@app/utils/routes';

import { useYlide } from '@app/contexts/ylide';

import * as S from './SettingsDetailView.styled';

const General: FC = () => (
  <S.ItemContainer className='flex flex-col'>
    <div className='mb-2 font-bold flex justify-between'>General</div>
    <div></div>
  </S.ItemContainer>
);

const Appearance: FC = () => <div>Appearance</div>;

const Security: FC = () => {
  const { keys, keystore, activeAccountAddress } = useYlide();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    const load = async () => {
      if (activeAccountAddress) {
        // console.log(
        //   String.fromCharCode.apply(
        //     null,
        //     await keystore.get(activeAccountAddress).getDecryptedKey()
        //   )
        // );
        // const key = keys.find(key => key.name === 'password');
        // if (key) {
        //   setPassword(key.);
        // }
        setPassword('123456');
      }
    };
    load();
  }, [keys, activeAccountAddress, keystore]);

  return (
    <S.ItemContainer className='flex flex-col'>
      <div className='mb-2 font-bold flex justify-between'>Security</div>
      <div className='flex'>
        <FormControl sx={{ m: 1, width: '25ch' }} variant='standard'>
          <InputLabel htmlFor='lock-password' shrink>
            Lock Password
          </InputLabel>
          <Input
            id='lock-password'
            type={showPassword ? 'text' : 'password'}
            readOnly
            defaultValue={password}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>
    </S.ItemContainer>
  );
};

const COMPONENTS = [General, Appearance, Security];

const SettingsDetailView: FC = () => {
  return (
    <S.Container>
      <div className='mb-2 font-bold flex justify-between'>
        <Routes>
          {routes.SETTINGS_ROUTES.map((route, i) => {
            const Component = COMPONENTS[i];
            return (
              <Route key={route} path={`/${route}`} element={<Component />} />
            );
          })}
          <Route
            path={'*'}
            element={
              <Navigate to={routes.setting(routes.SETTINGS_ROUTES[0])} />
            }
          />
        </Routes>
      </div>
    </S.Container>
  );
};

export default SettingsDetailView;
