import { createContext, ReactElement, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { SwarmIdClient, type ConnectionInfo } from "swarm-id/lib/src/index.ts";

import { persistUserSession, purgeUserSession, restoreUserSession, userLogin, UserSession } from "@/utils/user";

interface ContextInterface {
  keys: {
    private: string;
    public: string;
  };
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  username: string;
  isUserLoggedIn: boolean;
  isLoading: boolean;
  isSwarmEnabled: boolean;
  isSwarmInitialized: boolean;
  canUpload: boolean;
  identity?: ConnectionInfo["identity"];
}

const initialValues: ContextInterface = {
  keys: { private: "", public: "" },
  login: async () => { },
  logout: async () => { },
  connect: async () => { },
  disconnect: async () => { },
  username: "",
  isUserLoggedIn: false,
  isLoading: true,
  isSwarmEnabled: false,
  isSwarmInitialized: false,
  canUpload: false,
  identity: undefined,
};

export const Context = createContext<ContextInterface>(initialValues);
export const Consumer = Context.Consumer;

export const useUserContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error("useAppContext must be used within AppContextProvider");
  return context;
};

interface Props {
  children: ReactNode;
}

export function Provider({ children }: Props): ReactElement {
  const iframeOrigin = process.env.SWARM_ID_IFRAME_ORIGIN;
  const isSwarmEnabled = Boolean(iframeOrigin);

  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [swarmClient, setSwarmClient] = useState<SwarmIdClient | null>(null);
  const [isSwarmInitialized, setIsSwarmInitialized] = useState(false);
  const [isSwarmAuthenticated, setIsSwarmAuthenticated] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);

  const refreshSwarmAuth = async (client: SwarmIdClient) => {
    try {
      const status = await client.checkAuthStatus();
      setIsSwarmAuthenticated(status.authenticated);

      if (status.authenticated) {
        const info = await client.getConnectionInfo();
        setConnectionInfo(info);
      } else {
        setConnectionInfo(null);
      }
    } catch (error) {
      console.error("Failed to refresh Swarm ID auth state", error);
      setIsSwarmAuthenticated(false);
      setConnectionInfo(null);
    }
  };

  useEffect(() => {
    const savedSession = restoreUserSession();
    if (savedSession) {
      setUserSession(savedSession);
    }

    if (!isSwarmEnabled || !iframeOrigin) {
      setIsLoading(false);
      return;
    }

    const client = new SwarmIdClient({
      iframeOrigin,
      metadata: {
        name: "DevconAgora",
        description: "Decentralized conference companion app",
      },
      onAuthChange: async (authenticated) => {
        setIsSwarmAuthenticated(authenticated);

        if (authenticated) {
          try {
            const info = await client.getConnectionInfo();
            setConnectionInfo(info);
          } catch (error) {
            console.error("Failed to fetch Swarm ID connection info", error);
            setConnectionInfo(null);
          }
        } else {
          setConnectionInfo(null);
        }
      },
    });

    let isDisposed = false;

    const bootstrapSwarm = async () => {
      try {
        await client.initialize();
        if (isDisposed) {
          client.destroy();
          return;
        }

        setSwarmClient(client);
        setIsSwarmInitialized(true);
        await refreshSwarmAuth(client);
      } catch (error) {
        console.error("Failed to initialize Swarm ID client", error);
        setIsSwarmInitialized(false);
        setIsSwarmAuthenticated(false);
      } finally {
        if (!isDisposed) {
          setIsLoading(false);
        }
      }
    };

    bootstrapSwarm();

    return () => {
      isDisposed = true;
      try {
        client.destroy();
      } catch (error) {
        console.debug("Swarm client destroy error", error);
      }
      setSwarmClient(null);
      setIsSwarmInitialized(false);
      setIsSwarmAuthenticated(false);
      setConnectionInfo(null);
    };
  }, []);

  const login = async (username: string) => {
    const session = userLogin(username);

    if (session.id) {
      setUserSession(session);
      if (!isSwarmEnabled) {
        await persistUserSession(session);
      }
    }

    if (isSwarmEnabled && swarmClient) {
      swarmClient.connect({ popupMode: "popup" });
    }
  };

  const connect = async () => {
    if (!swarmClient) {
      return;
    }

    swarmClient.connect({ popupMode: "popup" });
    await refreshSwarmAuth(swarmClient);
  };

  const disconnect = async () => {
    if (!swarmClient) {
      return;
    }

    await swarmClient.disconnect();
    setIsSwarmAuthenticated(false);
    setConnectionInfo(null);
  };

  const logout = async () => {
    if (swarmClient) {
      try {
        await swarmClient.disconnect();
      } catch (error) {
        console.debug("Swarm disconnect failed during logout", error);
      }
    }

    setUserSession(null);
    setConnectionInfo(null);
    setIsSwarmAuthenticated(false);
    purgeUserSession();
  };

  const username = useMemo(() => {
    if (connectionInfo?.identity?.name) {
      return connectionInfo.identity.name;
    }
    return userSession?.name || "";
  }, [connectionInfo?.identity?.name, userSession]);

  const isUserLoggedIn = useMemo(() => {
    if (isSwarmEnabled) {
      return isSwarmAuthenticated;
    }
    return !!userSession;
  }, [isSwarmAuthenticated, isSwarmEnabled, userSession]);

  const keys = useMemo(() => {
    if (!userSession) {
      return { private: "", public: "" };
    }

    return {
      private: userSession.privKey,
      public: userSession.pubKey,
    };
  }, [userSession]);

  return (
    <Context.Provider
      value={{
        keys,
        login,
        logout,
        connect,
        disconnect,
        username,
        isUserLoggedIn,
        isLoading,
        isSwarmEnabled,
        isSwarmInitialized,
        canUpload: connectionInfo?.canUpload ?? false,
        identity: connectionInfo?.identity,
      }}
    >
      {children}
    </Context.Provider>
  );
}
