import React, { FC, useMemo, useReducer } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router';

import { Link } from '@styles/common';

import { useYlide, Item } from '@app/contexts/ylide';
import * as routes from '@app/utils/routes';

import PasswordInput from '@app/components/shared/PasswordInput';

import * as S from './ItemForm.styled';

enum ActionType {
  SetGroup = 'SET_GROUP',
  SetName = 'SET_NAME',
  SetUsername = 'SET_USERNAME',
  SetPassword = 'SET_PASSWORD',
  SetWebsite = 'SET_WEBSITE',
}

type Action =
  | { type: ActionType.SetGroup; group: string }
  | { type: ActionType.SetName; name: string }
  | { type: ActionType.SetUsername; username: string }
  | { type: ActionType.SetPassword; password: string }
  | { type: ActionType.SetWebsite; website: string };

const fromDataReducer = (state: Item, action: Action): Item => {
  switch (action.type) {
    case ActionType.SetGroup:
      return {
        ...state,
        group: action.group,
      };
    case ActionType.SetName:
      return {
        ...state,
        name: action.name,
      };
    case ActionType.SetUsername:
      return {
        ...state,
        username: action.username,
      };
    case ActionType.SetPassword:
      return {
        ...state,
        password: action.password,
      };
    case ActionType.SetWebsite:
      return {
        ...state,
        website: action.website,
      };

    default:
      return state;
  }
};

const DEFAULT_ITEM = {
  group: 'personal',
  name: 'Twitter',
  username: 'octo',
  password: '1234',
  website: 'https://twitter.com',
  accounts: [],
};

const ItemForm: FC<{ itemId?: string; item?: Item }> = ({
  itemId,
  item = DEFAULT_ITEM,
}) => {
  const { savePass, groups, workingLoader } = useYlide();
  const groupsList = useMemo(() => Array.from(groups.entries()), [groups]);
  const [formData, setFormData] = useReducer(fromDataReducer, item);
  const navigate = useNavigate();

  const formDisabled = useMemo(() => !!(itemId && item), [itemId, item]);

  const onSave = async () => {
    await savePass(formData);
    navigate(routes.items());
  };

  return (
    <S.Container className='flex flex-col gap-y-4'>
      <FormControl fullWidth>
        <InputLabel id='groups-select-label'>Group</InputLabel>
        <Select
          labelId='groups-select-label'
          id='groups-select'
          value={formData.group}
          label='Group'
          onChange={(e) => {
            setFormData({ type: ActionType.SetGroup, group: e.target.value });
          }}
          inputProps={{ readOnly: formDisabled }}
        >
          {groupsList.map(([id, { name, emoji }]) => (
            <MenuItem key={id} value={id}>
              {emoji} {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        id='name'
        label='Name'
        type='text'
        value={formData.name}
        onChange={(e) => {
          setFormData({ type: ActionType.SetName, name: e.target.value });
        }}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          readOnly: formDisabled,
        }}
      />
      <TextField
        id='username'
        label='Username'
        type='text'
        value={formData.username}
        onChange={(e) => {
          setFormData({
            type: ActionType.SetUsername,
            username: e.target.value,
          });
        }}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          readOnly: formDisabled,
        }}
      />
      <PasswordInput
        label='Password'
        type='password'
        value={formData.password}
        onChange={(e) => {
          setFormData({
            type: ActionType.SetPassword,
            password: e.target.value,
          });
        }}
        readOnly={formDisabled}
      />
      <TextField
        id='website'
        label='Website'
        type='url'
        value={formData.website}
        onChange={(e) => {
          setFormData({
            type: ActionType.SetWebsite,
            website: e.target.value,
          });
        }}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          readOnly: formDisabled,
        }}
      />
      {formDisabled ? null : (
        <div className='flex gap-x-2'>
          <Button
            color='primary'
            variant='contained'
            type='button'
            disableElevation
            onClick={onSave}
          >
            {workingLoader || <>Save</>}
          </Button>
          <Link to={routes.items()}>
            <Button color='primary' variant='outlined' type='button'>
              Cancel
            </Button>
          </Link>
        </div>
      )}
    </S.Container>
  );
};

export default ItemForm;
