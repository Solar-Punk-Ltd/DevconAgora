import { createContext, ReactElement, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { persistUserSession, purgeUserSession, restoreUserSession, userLogin, UserSession } from "@/utils/user";

interface ContextInterface {
  keys: {
    private: string;
    public: string;
  };
  login: (username: string) => Promise<void>;
  logout: () => void;
  username: string;
  isUserLoggedIn: boolean;
  isLoading: boolean;
}

const initialValues: ContextInterface = {
  keys: { private: "", public: "" },
  login: async () => {},
  logout: () => {},
  username: "",
  isUserLoggedIn: false,
  isLoading: true,
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
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSession = restoreUserSession();
    if (savedSession) {
      setUserSession(savedSession);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string) => {
    const session = userLogin(username);

    if (session.id) {
      setUserSession(session);
      await persistUserSession(session);
    }
  };

  const logout = () => {
    setUserSession(null);
    purgeUserSession();
  };

  const username = useMemo(() => userSession?.name || "", [userSession]);

  const isUserLoggedIn = useMemo(() => !!userSession, [userSession]);

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
        username,
        isUserLoggedIn,
        isLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
}
