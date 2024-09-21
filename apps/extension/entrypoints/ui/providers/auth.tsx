import { LayoutProps } from "@/types";
import { createContext } from "react";
import { Storage } from "wxt/browser";

type AuthContextType = {
  isAuthenticated: boolean;
  token: string;
  setToken: (token: string) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: LayoutProps) {
  const [token, setToken] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const getAuthToken = async () => {
    const authToken = (await browser.storage.local.get("authToken"))[
      "authToken"
    ];

    if (authToken) {
      setToken(authToken);
      setIsAuthenticated(authToken.length > 0);
    }
  };

  useEffect(() => {
    getAuthToken();

    const listener = (
      changes: Record<string, Storage.StorageChange>,
      areaName: string
    ) => {
      if (areaName === "local" && "authToken" in changes) {
        if (changes["authToken"].newValue) {
          setToken(changes["authToken"].newValue);
          setIsAuthenticated(true);
        } else {
          setToken("");
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
    <AuthContext.Provider value={{ token, setToken, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
