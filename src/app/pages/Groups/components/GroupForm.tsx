import React, { FC, useEffect, useMemo, useReducer, useState } from 'react';
import { Button, TextField } from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose as closeIcon } from '@fortawesome/free-solid-svg-icons';
// import { isAddress } from '@ethersproject/address';

import { Link } from '@styles/common';

import { Group, PERSONAL_GROUP_ID, useYlide } from '@app/contexts/ylide';
import * as routes from '@app/utils/routes';
import * as sl from '@app/utils/sl';

import * as S from './GroupForm.styled';

enum ActionType {
  SetName = 'SET_NAME',
  SetEmoji = 'SET_EMOJI',
  SetAccounts = 'SET_ACCOUNTS',
  Reset = 'RESET',
}

type Action =
  | { type: ActionType.SetName; name: string }
  | { type: ActionType.SetEmoji; emoji: string }
  | { type: ActionType.SetAccounts; accounts: string[] }
  | { type: ActionType.Reset; group: Group };

const fromDataReducer = (state: Group, action: Action): Group => {
  switch (action.type) {
    case ActionType.SetName:
      return {
        ...state,
        name: action.name,
      };
    case ActionType.SetEmoji:
      return {
        ...state,
        emoji: action.emoji,
      };
    case ActionType.SetAccounts:
      return {
        ...state,
        accounts: action.accounts,
      };
    case ActionType.Reset:
      return action.group;
    default:
      return state;
  }
};

const DEFAULT_GROUP: Group = {
  name: 'Maintenance',
  emoji: '🚧',
  accounts: [],
};

const GroupForm: FC<{ groupId?: string; group?: Group }> = ({
  groupId,
  group = DEFAULT_GROUP,
}) => {
  const {
    addGroup,
    updateGroup,
    activeAccountAddress,
    removeGroup,
  } = useYlide();
  const [formData, setFormData] = useReducer(fromDataReducer, group);
  const [accountToAdd, setAccountToAdd] = useState('');
  const navigate = useNavigate();

  const isPersonal = useMemo(() => groupId === PERSONAL_GROUP_ID, [groupId]);

  const onSave = () => {
    try {
      if (groupId) {
        updateGroup(groupId, formData);
      } else {
        groupId = addGroup(formData);
      }
    } catch (e) {
      toast.error((e as Error).message);
    }

    if (!group) {
      navigate(routes.group(groupId!));
    }
  };

  const onDelete = async () => {
    if (groupId) {
      const y = await sl.prompt(
        'Warning',
        'Are you sure you want to delete this group?'
      );
      if (y) {
        removeGroup(groupId);
        navigate(routes.groups());
      }
    }
  };

  useEffect(() => {
    if (isPersonal && activeAccountAddress) {
      group.accounts = [activeAccountAddress];
    }
    setFormData({ type: ActionType.Reset, group });
  }, [group, activeAccountAddress, isPersonal]);

  return (
    <S.Container className='flex flex-col gap-y-4'>
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
      />
      <TextField
        id='emoji'
        label='Emoji'
        type='text'
        value={formData.emoji}
        onChange={(e) => {
          setFormData({ type: ActionType.SetEmoji, emoji: e.target.value });
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <S.AccountsTextField
        id='accounts'
        label='Accounts'
        type='text'
        value={accountToAdd}
        multiline
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          disabled: isPersonal,
          startAdornment: (
            <S.Tags className='grid gap-1 grid-cols-1'>
              {formData.accounts.map((account) => (
                <S.Tag
                  className='flex items-center justify-between'
                  key={account}
                >
                  {/* {abbrAddr(account)} */}
                  {account}

                  {isPersonal ? null : (
                    <FontAwesomeIcon
                      icon={closeIcon}
                      className='cursor-pointer'
                      onClick={() => {
                        setFormData({
                          type: ActionType.SetAccounts,
                          accounts: formData.accounts.filter(
                            (a) => a !== account
                          ),
                        });
                      }}
                    />
                  )}
                </S.Tag>
              ))}
            </S.Tags>
          ),
        }}
        onChange={(e) => {
          if (isPersonal) return;

          setAccountToAdd((e.target.value as string).trim());
        }}
        onKeyDown={(e) => {
          if (isPersonal) return;

          const value = accountToAdd;
          switch (e.code) {
            case 'Enter': {
              if (value) {
                if (formData.accounts.includes(value)) {
                  return toast.error('Account already added');
                }
                // if (!isAddress(value)) {
                //   return toast.error('Invalid address');
                // }
                // todo: validate account pubkey is published
                setFormData({
                  type: ActionType.SetAccounts,
                  accounts: [...formData.accounts, value],
                });
                setAccountToAdd('');
              }
              break;
            }
            case 'Backspace': {
              if (!value) {
                setFormData({
                  type: ActionType.SetAccounts,
                  accounts: formData.accounts.slice(0, -1),
                });
              }
              break;
            }
            default: {
              break;
            }
          }
        }}
      />
      <div className='flex gap-x-2 justify-between'>
        <div className='flex gap-x-2'>
          <Button
            color='primary'
            variant='contained'
            type='button'
            disableElevation
            onClick={onSave}
          >
            {groupId ? 'Update' : 'Create'}
          </Button>
          <Link to={routes.groups()}>
            <Button color='primary' variant='outlined'>
              Cancel
            </Button>
          </Link>
        </div>
        {!groupId || isPersonal ? null : (
          <Button
            color='warning'
            variant='contained'
            type='button'
            disableElevation
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
      </div>
    </S.Container>
  );
};

export default GroupForm;
