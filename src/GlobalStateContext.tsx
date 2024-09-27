import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface GlobalState {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  monogram: string;
  setMonogram: React.Dispatch<React.SetStateAction<string>>;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  showGamification: boolean;
  setShowGamification: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({
  children,
}) => {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "Generated Nickname";
  });
  const [monogram, setMonogram] = useState(() => {
    return localStorage.getItem("monogram") || "";
  });

  const [points, setPoints] = useState(() => {
    const storedPoints = localStorage.getItem("points");
    return storedPoints ? parseInt(storedPoints, 10) : 0;
  });

  const [showGamification, setShowGamification] = useState(false);

  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem("monogram", monogram);
  }, [monogram]);

  useEffect(() => {
    localStorage.setItem("points", points.toString());
  }, [points]);

  return (
    <GlobalStateContext.Provider
      value={{
        username,
        setUsername,
        monogram,
        setMonogram,
        points,
        setPoints,
        showGamification,
        setShowGamification,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
