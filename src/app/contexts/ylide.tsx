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
// import {
//   everscaleBlockchainFactory,
//   everscaleWalletFactory,
// } from '@ylide/everscale';
import {
  evmFactories,
  ethereumWalletFactory,
  EVMNetwork,
  EVM_NAMES,
} from '@ylide/ethereum';
import {
  Ylide,
  // IMessage,
  // MessageContentV3,
  YlideKeyStore,
  BrowserLocalStorage,
  // MessagesList,
  AbstractWalletController,
  AbstractBlockchainController,
  WalletControllerFactory,
  YlideKeyPair,
  // GenericEntry,
  // BlockchainSource,
} from '@ylide/sdk';

import cache from '@app/utils/cache';

Ylide.registerBlockchainFactory(evmFactories[EVMNetwork.FANTOM]);
// Ylide.registerBlockchainFactory(everscaleBlockchainFactory);
Ylide.registerWalletFactory(ethereumWalletFactory);
// Ylide.registerWalletFactory(everscaleWalletFactory);

export type Wallet = { factory: WalletControllerFactory; isAvailable: boolean };
export type Wallets = Wallet[];

export type Account = { wallet: string; address: string };
export type Accounts = Account[];

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

const YlideContext = createContext<{
  walletsList: Wallets;
  addAccount: (factory: WalletControllerFactory) => Promise<void>;
  accounts: Accounts;
  startConnectAccount: () => void;
  activeAccount: Account | null;
  setActiveAccountAddress: (address: string) => void;
  accountsState: AccountsState;
  generateKey: (wallet: string, address: string) => Promise<void>;
  publishKey: (
    wallet: string,
    address: string,
    key: Uint8Array
  ) => Promise<void>;
} | null>(null);

const ACCOUNTS_CACHE_KEY = 'accounts';
const CACHED_ACCOUNTS: Account[] = cache(ACCOUNTS_CACHE_KEY) || [];

export const YlideProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [ylide, setYlide] = useState<Ylide | null>(null);
  const [walletsList, setWalletsList] = useState<Wallets>([]);
  const [accounts, setAccounts] = useState<Accounts>(CACHED_ACCOUNTS);
  const [activeAccountAddress, setActiveAccountAddress] = useState<
    string | null
  >(CACHED_ACCOUNTS[0]?.address ?? null);
  const [accountsState, setAccountsState] = useState<AccountsState>({});
  const [wallets, setWallets] = useState<
    { wallet: AbstractWalletController; factory: WalletControllerFactory }[]
  >([]);
  const [readers, setReaders] = useState<AbstractBlockchainController[]>([]);

  // const [sender, setSender] = useState<EthereumWalletController | null>(null);
  // const [reader, setReader] = useState<EthereumBlockchainController | null>(
  //     null
  // );
  const [keys, setKeys] = useState<YlideKeyStore['keys']>([]);

  const storage = useMemo(() => new BrowserLocalStorage(), []);
  const activeAccount = useMemo(
    () => accounts.find((a) => a.address === activeAccountAddress) ?? null,
    [activeAccountAddress, accounts]
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

  // cache accounts on change
  useEffect(() => {
    localStorage.setItem(ACCOUNTS_CACHE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  // load available wallets
  useEffect(() => {
    (async () => {
      const list = Ylide.walletsList;
      const result: {
        factory: WalletControllerFactory;
        isAvailable: boolean;
      }[] = [];
      for (const { factory } of list) {
        result.push({
          factory,
          isAvailable: await factory.isWalletAvailable(),
        });
      }
      setWalletsList(result);
    })();
  }, []);

  // init ylide
  useEffect(() => {
    (async () => {
      await keystore.init();

      const _ylide = new Ylide(keystore);
      const _readers = [
        await _ylide.addBlockchain('everscale', {
          dev: false, //true,
        }),
        await _ylide.addBlockchain('ETHEREUM'),
        await _ylide.addBlockchain('BNBCHAIN'),
        await _ylide.addBlockchain('POLYGON'),
        await _ylide.addBlockchain('ARBITRUM'),
        await _ylide.addBlockchain('OPTIMISM'),
        await _ylide.addBlockchain('AVALANCHE'),
      ];

      setYlide(_ylide);
      setReaders(_readers);
      setKeys([...keystore.keys]);
    })();
  }, [
    keystore,
    // inbox, sent
  ]);

  // load
  useEffect(() => {
    if (!ylide) {
      return;
    }
    (async () => {
      const availableWallets = await Ylide.getAvailableWallets();
      setWallets(
        await Promise.all(
          availableWallets.map(async (w) => {
            return {
              factory: w,
              wallet: await ylide.addWallet(w.blockchainGroup, w.wallet, {
                dev: false, //true,
                onNetworkSwitchRequest: async (
                  reason: string,
                  currentNetwork: EVMNetwork | undefined,
                  needNetwork: EVMNetwork,
                  needChainId: number
                ) => {
                  alert(
                    'Wrong network (' +
                      (currentNetwork
                        ? EVM_NAMES[currentNetwork]
                        : 'undefined') +
                      '), switch to ' +
                      EVM_NAMES[needNetwork]
                  );
                },
              }),
            };
          })
        )
      );
    })();
  }, [ylide]);

  // load account states
  useEffect(() => {
    if (!wallets.length) {
      return;
    }
    (async () => {
      const result: AccountsState = {};
      for (let acc of accounts) {
        const wallet = wallets.find((w) => w.factory.wallet === acc.wallet);
        result[acc.address] = {
          wallet: wallet || null,
          localKey:
            keys.find((k) => k.address === acc.address)?.keypair || null,
          // localKey: keys.find((k) => k.address === acc.address)?.key || null,
          remoteKey:
            (
              await Promise.all(
                readers.map(async (r) => {
                  if (!r.isAddressValid(acc.address)) {
                    return null;
                  }
                  const c = await r.extractPublicKeyFromAddress(acc.address);
                  if (c) {
                    console.log(`found public key for ${acc.address} in `, r);
                    return c.bytes;
                  } else {
                    return null;
                  }
                })
              )
            ).find((t) => !!t) || null,
        };
      }
      setAccountsState(result);
    })();
  }, [accounts, keys, readers, wallets]);

  // connect account
  const addAccount = useCallback(
    async (factory: WalletControllerFactory) => {
      const tempWallet = await factory.create({
        onNetworkSwitchRequest: () => {},
      });
      const newAcc = await tempWallet.requestAuthentication();
      if (!newAcc) {
        alert('Auth was rejected');
        return;
      }
      const exists = accounts.some((a) => a.address === newAcc.address);
      if (exists) {
        alert('Already registered');
        return;
      }
      setAccounts((accounts) =>
        accounts.concat([
          {
            wallet: factory.wallet,
            address: newAcc.address,
          },
        ])
      );
    },
    [accounts]
  );

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

  useEffect(() => {
    keystore.options.onPasswordRequest = handlePasswordRequest;
    keystore.options.onDeriveRequest = handleDeriveRequest;
  }, [handlePasswordRequest, handleDeriveRequest, keystore]);

  const startConnectAccount = () => {};

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
      account.wallet!.wallet.attachPublicKey(
        { address, blockchain: '', publicKey: null },
        key,
        {
          address,
          network: EVMNetwork.ARBITRUM,
        }
      );
    },
    [accountsState]
  );

  return (
    <YlideContext.Provider
      value={{
        walletsList,
        addAccount,
        accounts,
        startConnectAccount,
        activeAccount,
        setActiveAccountAddress,
        accountsState,
        generateKey,
        publishKey,
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
