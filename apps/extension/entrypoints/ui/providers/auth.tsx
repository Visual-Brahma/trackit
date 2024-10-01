import { LayoutProps } from "@/types";
import { createContext } from "react";
import { Storage } from "wxt/browser";

type AuthContextType = {
  isAuthenticated: boolean;
  token?: string;
  setToken: (token: string) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: LayoutProps) {
  const [authToken, setAuthToken] = useState<string>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const getAuthToken = async () => {
    const authToken = (await browser.storage.local.get("authToken"))[
      "authToken"
    ];

    if (authToken) {
      setAuthToken(authToken);
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    getAuthToken();

    const listener = (
      changes: Record<string, Storage.StorageChange>,
      areaName: string,
    ) => {
      if (areaName === "local" && "authToken" in changes) {
        if (changes["authToken"].newValue) {
          setAuthToken(changes["authToken"].newValue);
          setIsAuthenticated(true);
        } else {
          setAuthToken(undefined);
          setIsAuthenticated(false);
        }
      }
    };

    browser.storage.onChanged.addListener(listener);

    return () => {
      browser.storage.onChanged.removeListener(listener);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ token: authToken, setToken: setAuthToken, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}
