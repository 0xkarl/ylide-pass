import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  Ylide,
  MessageContentV3,
  YlideKeyStore,
  BrowserLocalStorage,
  AbstractWalletController,
  AbstractBlockchainController,
  WalletControllerFactory,
  YlideKeyPair,
  BlockchainListSource,
  SourceReadingSession,
  IndexerListSource,
  ListSourceMultiplexer,
  ListSourceDrainer,
  BlockchainSourceType,
  ServiceCode,
  IGenericAccount,
  IMessageWithSource,
} from '0xkarl-sdk';
import {
  everscaleBlockchainFactory,
  everscaleWalletFactory,
} from '0xkarl-everscale';
import {
  evmFactories,
  ethereumWalletFactory,
  EVMNetwork,
  EVM_NAMES,
  EthereumBlockchainController,
  EthereumListSource,
} from '@ylide/ethereum';
import { v4 as uuid } from 'uuid';

import cache from '@app/utils/cache';
import { sleep } from '@app/utils/promise';
import Loader from '@app/components/shared/Loader';

Ylide.registerBlockchainFactory(evmFactories[EVMNetwork.FANTOM]);
Ylide.registerBlockchainFactory(everscaleBlockchainFactory);
// @ts-ignore
Ylide.registerWalletFactory(ethereumWalletFactory);
// @ts-ignore
Ylide.registerWalletFactory(everscaleWalletFactory);

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

type Blockchain = string;
export const NETWORKS: Map<EVMNetwork, Blockchain> = new Map([
  [EVMNetwork.FANTOM, 'fantom'],
]);
const DEFAULT_NETWORK = EVMNetwork.FANTOM;

export type Item = {
  group: string;
  name: string;
  username: string;
  password: string;
  website: string;
  accounts: string[];
};

export const PERSONAL_GROUP_ID = 'personal';

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

const YlideContext = createContext<{
  wallets: Wallets;
  addAccount: (factory: WalletControllerFactory) => Promise<void>;
  accounts: Accounts;
  startConnectAccount: (index: number) => Promise<void>;
  activeAccount: Account | null;
  setActiveAccountAddress: (address: string | null) => void;
  activeAccountState: AccountState | null;
  generateKey: (wallet: string, address: string) => Promise<void>;
  publishKey: (
    wallet: string,
    address: string,
    key: Uint8Array
  ) => Promise<void>;
  items: Map<string, Item> | null;
  savePass: (item: Item) => Promise<void>;
  activeAccountStateStatus: StateStatus;
  groups: Groups;
  addGroup: (group: Group) => string;
  updateGroup: (id: string, group: Group) => void;
  removeGroup: (id: string) => void;
  network: EVMNetwork;
  blockchain: Blockchain;
  setNetwork: (network: EVMNetwork) => void;
  activeAccountAddress: string | null;
  isAddingAccount: boolean;
  appIsReady: boolean;
  reloadLocation: () => Promise<void>;
  working: boolean;
  setWorking: (working: boolean) => void;
  workingLoader: ReactNode | null;
} | null>(null);

const ACCOUNTS_CACHE_KEY = 'accounts';
const CACHED_ACCOUNTS: Account[] = cache(ACCOUNTS_CACHE_KEY) || [];
const ACTIVE_ACCOUNT_ADDRESS_CACHE_KEY = 'active-account-address';
const ACTIVE_ACCOUNT_ADDRESS = (() => {
  const address = cache(ACTIVE_ACCOUNT_ADDRESS_CACHE_KEY) || null;
  if (address) {
    for (const account of CACHED_ACCOUNTS) {
      if (account.address === address) {
        return address;
      }
    }
  }
  return null;
})();
const GROUPS_CACHE_KEY = !ACTIVE_ACCOUNT_ADDRESS
  ? null
  : `group-${ACTIVE_ACCOUNT_ADDRESS}`;
const CACHED_GROUPS = (() => {
  if (!GROUPS_CACHE_KEY) return;
  return (
    cache(GROUPS_CACHE_KEY) || [
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
})();

export const YlideProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [ylide, setYlide] = useState<Ylide | null>(null);
  const [wallets, setWallets] = useState<Wallets>([]);
  const [accounts, setAccounts] = useState<Accounts>(CACHED_ACCOUNTS);
  const [activeAccountAddress, setActiveAccountAddress] = useState<
    string | null
  >(ACTIVE_ACCOUNT_ADDRESS);
  const [accountsState, setAccountsState] = useState<AccountsState>({});
  const [
    activeGenericAccount,
    setActiveGenericAccount,
  ] = useState<IGenericAccount | null>(null);
  const [readers, setReaders] = useState<AbstractBlockchainController[]>([]);
  // const [sender, setSender] = useState<EthereumWalletController | null>(null);
  // const [reader, setReader] = useState<EthereumBlockchainController | null>(
  //     null
  // );
  const [keys, setKeys] = useState<YlideKeyStore['keys']>([]);
  const [items, setItems] = useState<Map<string, Item> | null>(null);
  const [groups, setGroups] = useState<Groups>(new Map(CACHED_GROUPS));
  const [network, setNetwork] = useState<EVMNetwork>(DEFAULT_NETWORK);
  const [working, setWorking] = useState(false);

  const storage = useMemo(() => new BrowserLocalStorage(), []);
  const activeAccount = useMemo(
    () => accounts.find((a) => a.address === activeAccountAddress) ?? null,
    [activeAccountAddress, accounts]
  );

  // const activeAccountReader = useMemo(() => !readers ? null : readers.find(r => r.), [readers, activeAccount]);
  const activeAccountState = useMemo(
    () => (!activeAccountAddress ? null : accountsState[activeAccountAddress]),
    [accountsState, activeAccountAddress]
  );
  const keystore = useMemo(
    () =>
      new YlideKeyStore(storage, {
        onPasswordRequest: async (reason: string) =>
          prompt(`Enter Ylide password for ${reason}:`),

        onDeriveRequest: async (
          reason: string,
          blockchainGroup: string,
          wallet: any,
          address: string,
          magicString: string
        ) => {
          try {
            return wallet.signMagicString(magicString);
          } catch (err) {
            return null;
          }
        },
      }),
    [storage]
  );
  const readingSession = useMemo(() => {
    const readingSession = new SourceReadingSession();

    readingSession.sourceOptimizer = (subject, reader) => {
      const useIndexer = true;
      if (reader instanceof EthereumBlockchainController) {
        const evmListSource = new EthereumListSource(reader, subject, 30000);
        if (useIndexer) {
          return new IndexerListSource(
            evmListSource,
            readingSession.indexerHub,
            reader,
            subject
          );
        } else {
          return evmListSource;
        }
      } else {
        return new BlockchainListSource(reader, subject, 10000);
      }
    };

    return readingSession;
  }, []);
  const activeAccountWallet = useMemo(() => {
    if (activeAccount) {
      for (const w of wallets) {
        if (w.factory.wallet === activeAccount.wallet) {
          return w;
        }
      }
    }
    return wallets[0];
  }, [activeAccount, wallets]);

  const blockchain = useMemo(() => {
    const blockchain =
      activeAccountWallet?.factory.blockchainGroup || 'everscale';
    return blockchain !== 'everscale' ? 'fantom' : blockchain;
  }, [activeAccountWallet]);

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
  const activeAccountAddressUint256 = useMemo(
    () =>
      !(activeAccountWallet && activeAccount)
        ? null
        : activeAccountWallet.wallet.addressToUint256(activeAccount.address),
    [activeAccountWallet, activeAccount]
  );

  const listSourceDrainer = useMemo(() => {
    if (
      !(
        reader &&
        blockchain &&
        activeAccountAddress &&
        activeAccountAddressUint256
      )
    )
      return null;

    return new ListSourceDrainer(
      new ListSourceMultiplexer([
        readingSession.listSource(
          {
            blockchain,
            type: BlockchainSourceType.DIRECT,
            recipient: activeAccountAddressUint256,
            sender: null,
          },
          reader
        ),
        readingSession.listSource(
          {
            blockchain,
            type: BlockchainSourceType.DIRECT,
            recipient: Ylide.getSentAddress(activeAccountAddressUint256),
            sender: null,
          },
          reader
        ),
      ])
    );
  }, [
    readingSession,
    reader,
    blockchain,
    activeAccountAddress,
    activeAccountAddressUint256,
  ]);

  const activeAccountStateStatus = useMemo(() => {
    const state = activeAccountState;
    return state
      ? state.localKey
        ? state.remoteKey
          ? state.remoteKey.every((e, i) => state.localKey!.publicKey[i] === e)
            ? StateStatus.REGISTERED
            : StateStatus.LOCAL_KEY_DOES_NOT_MATCH_REMOTE
          : StateStatus.NOT_REGISTERED
        : StateStatus.NOT_AVAILABLE
      : StateStatus.NO_STATE;
  }, [activeAccountState]);

  const appIsReady = useMemo(
    () =>
      !activeAccountAddress ||
      !accounts.length ||
      activeAccountStateStatus !== StateStatus.NO_STATE,
    [accounts, activeAccountStateStatus, activeAccountAddress]
  );

  const isAddingAccount = useMemo(
    () => activeAccountStateStatus !== StateStatus.REGISTERED,
    [activeAccountStateStatus]
  );

  const workingLoader = useMemo(
    () => (!working ? null : <Loader text='Please wait' />),
    [working]
  );

  //

  const handlePasswordRequest = useCallback(async (reason: string) => {
    return prompt(`Enter Ylide password for ${reason}`);
  }, []);

  const handleDeriveRequest = useCallback(
    async (
      reason: string,
      blockchain: string,
      wallet: string,
      address: string,
      magicString: string
    ) => {
      const state = accountsState[address];
      if (!state) {
        return null;
      }
      try {
        return state.wallet!.wallet.signMagicString(
          { address, blockchain, publicKey: null },
          magicString
        );
      } catch (err) {
        return null;
      }
    },
    [accountsState]
  );

  // connect account
  const addAccount = useCallback(
    async (factory: WalletControllerFactory) => {
      const tempWallet = await factory.create({
        onNetworkSwitchRequest: () => {},
      });
      const newAcc = await tempWallet.requestAuthentication();
      if (newAcc) {
        const exists = accounts.find((a) => a.address === newAcc.address);
        if (exists) {
          setActiveAccountAddress(exists.address);
          reloadLocation();
        } else {
          setAccounts((accounts) =>
            accounts.concat([
              {
                wallet: factory.wallet,
                address: newAcc.address,
              },
            ])
          );
          setActiveAccountAddress(newAcc.address);
          reloadLocation();
        }
      }
    },
    [accounts]
  );

  const startConnectAccount = async (index: number) => {
    const wallet = wallets[index];
    if (wallet) {
      await wallet.wallet.requestAuthentication();
    }
  };

  const generateKey = useCallback(
    async (wallet: string, address: string) => {
      const account = accountsState[address];
      const password = await keystore.options.onPasswordRequest(
        `Generation key for ${address}`
      );
      if (!password) {
        return;
      }
      await keystore.create(
        `Generation key for ${address}`,
        account.wallet!.factory.blockchainGroup,
        wallet,
        address,
        password
      );
      document.location.reload();
    },
    [keystore, accountsState]
  );

  const publishKey = useCallback(
    async (wallet: string, address: string, key: Uint8Array) => {
      const account = accountsState[address];
      await account.wallet!.wallet.attachPublicKey(
        { address, blockchain: '', publicKey: null },
        key,
        {
          address,
          network,
        }
      );
      document.location.reload();
    },
    [accountsState, network]
  );

  const savePass = useCallback(
    async (item: Item) => {
      setWorking(true);
      try {
        if (
          !(
            ylide &&
            activeAccountWallet &&
            activeGenericAccount &&
            activeAccountAddress
          )
        )
          return;

        if (!activeGenericAccount) throw new Error('Account not found');

        const group = groups.get(item.group);
        if (!group) throw new Error(`Group(item.group) not found`);

        const to =
          item.group === PERSONAL_GROUP_ID
            ? [activeAccountAddress]
            : group.accounts.slice();

        if (!to.length) throw new Error(`Group(item.group) has no accounts`);

        item.accounts = to;

        const content = MessageContentV3.plain(
          Date.now().toString(),
          JSON.stringify(item)
        );

        await ylide.sendMessage(
          {
            wallet: activeAccountWallet.wallet,
            sender: activeGenericAccount,
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
    [
      ylide,
      activeAccountWallet,
      activeAccountAddress,
      network,
      activeGenericAccount,
      groups,
    ]
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

  const reloadLocation = async () => {
    await sleep(500);
    document.location.reload();
  };

  // init ylide
  useEffect(() => {
    (async () => {
      await keystore.init();

      const _ylide = new Ylide(keystore);
      const _readers = await Promise.all([
        _ylide.addBlockchain('everscale', {
          dev: false, //true,
        }),
        // _ylide.addBlockchain('ETHEREUM'),
        // _ylide.addBlockchain('BNBCHAIN'),
        // _ylide.addBlockchain('POLYGON'),
        // _ylide.addBlockchain('ARBITRUM'),
        // _ylide.addBlockchain('OPTIMISM'),
        // _ylide.addBlockchain('AVALANCHE'),
        _ylide.addBlockchain('FANTOM'),
      ]);

      setYlide(_ylide);
      setReaders(_readers);
      setKeys([...keystore.keys]);
    })();
  }, [keystore]);

  // load available wallets
  useEffect(() => {
    if (!ylide) {
      return;
    }

    const loadWallets = async () => {
      const availableWallets = await Ylide.getAvailableWallets();
      setWallets(await Promise.all(availableWallets.map(loadWallet)));
    };

    const loadWallet = async (factory: WalletControllerFactory) => {
      return {
        factory,
        wallet: await ylide.addWallet(factory.blockchainGroup, factory.wallet, {
          dev: false, //true,
          onNetworkSwitchRequest: async (
            reason: string,
            currentNetwork: EVMNetwork | undefined,
            needNetwork: EVMNetwork,
            needChainId: number
          ) => {
            alert(
              'Wrong network (' +
                (currentNetwork ? EVM_NAMES[currentNetwork] : 'undefined') +
                '), switch to ' +
                EVM_NAMES[needNetwork]
            );
          },
        }),
        isAvailable: await factory.isWalletAvailable(),
      };
    };

    loadWallets();
  }, [ylide]);

  // set generic account
  useEffect(() => {
    if (!activeAccountState?.wallet?.wallet) return;
    const load = async () => {
      const account = await activeAccountState?.wallet?.wallet.getAuthenticatedAccount();
      if (account) {
        setActiveGenericAccount(account);
      }
    };
    load();
  }, [activeAccountState]);

  // cache accounts on change
  useEffect(() => {
    cache(ACCOUNTS_CACHE_KEY, accounts);
  }, [accounts]);
  useEffect(() => {
    cache(ACTIVE_ACCOUNT_ADDRESS_CACHE_KEY, activeAccountAddress);
  }, [activeAccountAddress]);

  // load account states
  useEffect(() => {
    if (!wallets.length) {
      return;
    }
    (async () => {
      const result: AccountsState = {};
      for (let acc of accounts) {
        const wallet = wallets.find((w) => w.factory.wallet === acc.wallet);
        const remoteKeys = (
          await Promise.allSettled(
            readers.map(async (r) => {
              if (!r.isAddressValid(acc.address)) {
                return null;
              }
              const c = await r.extractPublicKeyFromAddress(acc.address);
              if (c) {
                // console.log(`found public key for ${acc.address} in `, r);
                return c;
              } else {
                return null;
              }
            })
          )
        ).map((r) => (r.status === 'rejected' ? null : r.value));
        const localKeys = keys;
        result[acc.address] = {
          wallet: wallet || null,
          localKey:
            localKeys.find((k) => k.address === acc.address)?.keypair || null,
          remoteKey: remoteKeys.find((t) => !!t)?.bytes || null,
        };
      }
      setAccountsState(result);
    })();
  }, [accounts, keys, readers, wallets]);

  // load and subscribe to messages
  useEffect(() => {
    if (!(listSourceDrainer && ylide && activeGenericAccount)) return;

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
            activeGenericAccount,
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
  }, [listSourceDrainer, ylide, activeGenericAccount, reader]);

  //
  useEffect(() => {
    keystore.options.onPasswordRequest = handlePasswordRequest;
    keystore.options.onDeriveRequest = handleDeriveRequest;
  }, [handlePasswordRequest, handleDeriveRequest, keystore]);

  // cache groups
  useEffect(() => {
    if (GROUPS_CACHE_KEY) cache(GROUPS_CACHE_KEY, Array.from(groups.entries()));
  }, [groups]);

  return (
    <YlideContext.Provider
      value={{
        wallets,
        addAccount,
        accounts,
        startConnectAccount,
        activeAccount,
        setActiveAccountAddress,
        activeAccountState,
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
        setNetwork,
        activeAccountAddress,
        isAddingAccount,
        appIsReady,
        reloadLocation,
        working,
        setWorking,
        workingLoader,
      }}
    >
      {children}
    </YlideContext.Provider>
  );
};

export function useYlide() {
  const context = useContext(YlideContext);
  if (!context) {
    throw new Error('Missing Ylide context');
  }
  return context;
}
