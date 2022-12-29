import React, { FC, useState, MouseEvent } from 'react';
import {
  TextField,
  IconButton,
  InputAdornment,
  TextFieldProps,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PasswordInput: FC<TextFieldProps & { readOnly: boolean }> = ({
  readOnly,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <TextField
      {...props}
      id='password'
      type={showPassword ? 'text' : 'password'}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        readOnly,
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordInput;
