import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Ylide,
  MessageContentV3,
  YlideKeyStore,
  AbstractWalletController,
  AbstractBlockchainController,
  WalletControllerFactory,
  YlideKeyPair,
  SourceReadingSession,
  ListSourceMultiplexer,
  ListSourceDrainer,
  BlockchainSourceType,
  ServiceCode,
  IGenericAccount,
  IMessageWithSource,
} from '0xkarl-sdk';
import { v4 as uuid } from 'uuid';
import { PublicKey } from '@ylide/sdk';

import cache from '@app/utils/cache';
import { PERSONAL_GROUP_ID } from '@app/contexts/ylide';

export type Wallet = {
  factory: WalletControllerFactory;
  isAvailable: boolean;
  wallet: AbstractWalletController;
};
export type Wallets = Wallet[];

export type Account = { wallet: string; address: string };
export type Accounts = Account[];

export type Group = { name: string; accounts: string[]; emoji: string };
export type Groups = Map<string, Group>;

export type Item = {
  group: string;
  name: string;
  username: string;
  password: string;
  website: string;
  accounts: string[];
};

export type AccountState = {
  // localKey: YlideKeyPair | null;
  // remoteKey: Uint8Array | null;
  // wallet: {
  //   wallet: AbstractWalletController;
  //   factory: WalletControllerFactory;
  // } | null;
  wallet: {
    wallet: AbstractWalletController;
    factory: WalletControllerFactory;
  } | null;
  localKey: YlideKeyPair | null;
  remoteKey: Uint8Array | null;
};
export type AccountsState = Record<string, AccountState>;
export enum StateStatus {
  REGISTERED = 1,
  LOCAL_KEY_DOES_NOT_MATCH_REMOTE,
  NOT_REGISTERED,
  NOT_AVAILABLE,
  NO_STATE,
}

export function useAccount({
  ylide,
  accounts,
  readingSession,
  keystore,
  readers,
  localKeys,
  //
  address,
  wallet,
  factory,
}: {
  ylide: Ylide;
  accounts: Account[];
  readingSession: SourceReadingSession;
  keystore: YlideKeyStore;
  readers: AbstractBlockchainController[];
  localKeys: YlideKeyStore['keys'];
  //
  address: string;
  wallet: AbstractWalletController;
  factory: WalletControllerFactory;
}) {
  const groupsCacheKey = `group-${address}`;

  const getCachedGroups = () => {
    return (
      cache(groupsCacheKey) || [
        [
          PERSONAL_GROUP_ID,
          {
            emoji: '🎒',
            name: 'Personal',
            accounts: [],
          },
        ],
        [
          'engineering',
          {
            emoji: '🛠',
            name: 'Engineering',
            accounts: [],
          },
        ],
        [
          'family',
          {
            emoji: '👨‍👩‍👧‍👦',
            name: 'Family',
            accounts: [],
          },
        ],
      ]
    );
  };

  const cacheGroups = useCallback(
    (groups: Groups) => {
      cache(groupsCacheKey, Array.from(groups));
    },
    [groupsCacheKey]
  );

  const [remoteKey, setRemoteKey] = useState<PublicKey | null>(null);
  const [
    authenticatedAccount,
    setAuthenticatedAccount,
  ] = useState<IGenericAccount | null>(null);
  const [items, setItems] = useState<Map<string, Item> | null>(null);
  const [groups, setGroups] = useState<Groups>(new Map(getCachedGroups()));
  const [working, setWorking] = useState(false);

  const blockchain = useMemo(() => {
    const blockchain = factory.blockchainGroup || 'everscale';
    return blockchain !== 'everscale' ? 'fantom' : blockchain;
  }, [factory]);

  const network = useMemo(() => blockchain, [blockchain]);

  const reader = useMemo(() => {
    for (const r of readers) {
      if (
        r.blockchain().toLocaleLowerCase() === blockchain.toLocaleLowerCase()
      ) {
        return r;
      }
    }
    return readers[0];
  }, [readers, blockchain]);

  const localKey = useMemo(
    () => localKeys.find((k) => k.address === address)?.keypair || null,
    [localKeys, address]
  );

  const addressUint256 = useMemo(() => wallet.addressToUint256(address), [
    wallet,
    address,
  ]);

  const listSourceDrainer = useMemo(() => {
    if (!(reader && blockchain)) return null;

    return new ListSourceDrainer(
      new ListSourceMultiplexer([
        readingSession.listSource(
          {
            blockchain,
            type: BlockchainSourceType.DIRECT,
            recipient: addressUint256,
            sender: null,
          },
          reader
        ),
        readingSession.listSource(
          {
            blockchain,
            type: BlockchainSourceType.DIRECT,
            recipient: Ylide.getSentAddress(addressUint256),
            sender: null,
          },
          reader
        ),
      ])
    );
  }, [readingSession, reader, blockchain, addressUint256]);

  const activeAccountStateStatus = useMemo(() => {
    return localKey && remoteKey
      ? localKey
        ? remoteKey
          ? remoteKey.bytes.every((e, i) => localKey.publicKey[i] === e)
            ? StateStatus.REGISTERED
            : StateStatus.LOCAL_KEY_DOES_NOT_MATCH_REMOTE
          : StateStatus.NOT_REGISTERED
        : StateStatus.NOT_AVAILABLE
      : StateStatus.NO_STATE;
  }, [localKey, remoteKey]);

  //

  const startConnectAccount = async () => {
    await wallet.requestAuthentication();
  };

  const generateKey = useCallback(async () => {
    setWorking(true);
    try {
      const password = await keystore.options.onPasswordRequest(
        `Generation key for ${address}`
      );
      if (!password) {
        return;
      }
      await keystore.create(
        'store',
        factory.blockchainGroup,
        factory.wallet,
        address,
        password
      );
      // saveAccount({
      //   address,
      //   wallet,
      // });
    } finally {
      setWorking(false);
    }
  }, [keystore, address, factory]);

  const publishKey = useCallback(
    async (key: Uint8Array) => {
      setWorking(true);
      try {
        await wallet.attachPublicKey(
          { address, blockchain: '', publicKey: null },
          key,
          {
            address,
            network,
          }
        );
        document.location.reload();
      } finally {
        setWorking(false);
      }
    },
    [network, address, wallet]
  );

  const savePass = useCallback(
    async (item: Item) => {
      setWorking(true);
      try {
        if (!(ylide && authenticatedAccount)) return;

        if (!authenticatedAccount) throw new Error('Account not found');

        const group = groups.get(item.group);
        if (!group) throw new Error(`Group(item.group) not found`);

        const to =
          item.group === PERSONAL_GROUP_ID ? [address] : group.accounts.slice();

        if (!to.length) throw new Error(`Group(item.group) has no accounts`);

        item.accounts = to;

        const content = MessageContentV3.plain(
          Date.now().toString(),
          JSON.stringify(item)
        );

        await ylide.sendMessage(
          {
            wallet,
            sender: authenticatedAccount,
            content,
            recipients: to,
            serviceCode: ServiceCode.MAIL,
          },
          {
            network,
          }
        );
      } finally {
        setWorking(false);
      }
    },
    [ylide, address, wallet, network, authenticatedAccount, groups]
  );

  const addGroup = (group: Group) => {
    for (const g of groups.values()) {
      if (g.name === group.name) {
        throw new Error(`Group(${group.name}) already exists.`);
      }
    }

    if (!group.accounts.length) {
      throw new Error(`Add some accounts to the group.`);
    }

    const groupId = uuid();

    setGroups((groups) => {
      const copy = new Map(groups);
      copy.set(groupId, group);
      return copy;
    });

    return groupId;
  };
  const updateGroup = (groupId: string, group: Group) => {
    for (const [gid, g] of groups.entries()) {
      if (gid !== groupId && g.name === group.name) {
        throw new Error(`Group(${group.name}) already exists.`);
      }
    }

    setGroups((groups) => {
      const copy = new Map(groups);
      copy.set(groupId, group);
      return copy;
    });
  };
  const removeGroup = (id: string) => {
    setGroups((groups) => {
      const copy = new Map(groups);
      copy.delete(id);
      return copy;
    });
  };

  // set generic account
  useEffect(() => {
    const load = async () => {
      const account = await wallet.getAuthenticatedAccount();
      if (account) {
        setAuthenticatedAccount(account);
      }
    };
    load();
  }, [wallet]);

  // load remote key
  useEffect(() => {
    (async () => {
      const remoteKey = await (async () => {
        if (!reader.isAddressValid(address)) {
          return null;
        }
        const c = await reader.extractPublicKeyFromAddress(address);
        if (c) {
          // console.log(`found public key for ${acc.address} in `, r);
          return c;
        } else {
          return null;
        }
      })();

      setRemoteKey(remoteKey ?? null);
    })();
  }, [address, reader, wallet]);

  // load and subscribe to messages
  useEffect(() => {
    if (!(listSourceDrainer && ylide && authenticatedAccount)) return;

    const saveMessages = async (msgs: IMessageWithSource[]) => {
      const newItems: Map<string, Item> = new Map();
      for (const m of msgs) {
        const { msg: message } = m;
        const content = await reader.retrieveAndVerifyMessageContent(message);
        if (!content || content.corrupted) {
          console.error('failed to retrieve message content');
          continue;
        }
        try {
          const g = await ylide.decryptMessageContent(
            authenticatedAccount,
            message,
            content
          );
          const m = JSON.parse(g.content) as Item;
          if (
            m.group &&
            m.name &&
            m.username &&
            m.password &&
            m.website &&
            m.accounts
          ) {
            newItems.set(message.msgId, m);
          }
        } catch (e) {
          if (!~(e as Error).message.indexOf('Invalid box or key')) {
            console.warn('failed to decrypt message content', e);
          }
        }
      }

      setItems((items) => {
        const copy = new Map(items);
        for (const [id, msg] of newItems) {
          if (!copy.has(id)) {
            copy.set(id, msg);
          }
        }
        return copy;
      });
    };

    const subscribe = async () => {
      listSourceDrainer.on('messages', async ({ messages: newMessages }) => {
        // console.log(`you've got a new messages, yoohoo: `, newMessages);
        saveMessages(newMessages);
      });

      await listSourceDrainer.resume(); // we need to activate list before we will be able to read from it

      saveMessages(await listSourceDrainer.readMore(10));
    };
    subscribe();

    return () => {
      listSourceDrainer.pause();
    };
  }, [listSourceDrainer, ylide, authenticatedAccount, reader]);

  // cache groups
  useEffect(() => {
    cacheGroups(groups);
  }, [groups, cacheGroups]);

  return {
    accounts,
    startConnectAccount,
    generateKey,
    publishKey,
    items,
    savePass,
    activeAccountStateStatus,
    groups,
    addGroup,
    updateGroup,
    removeGroup,
    network,
    blockchain,
    working,
    setWorking,
  };
}
