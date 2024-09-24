import { LayoutProps } from "@/types";
import { createContext } from "react";
import { Cookies, Storage } from "wxt/browser";

type AuthContextType = {
  isAuthenticated: boolean;
  token?: Cookies.Cookie;
  setToken: (token: Cookies.Cookie) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: LayoutProps) {
  const [authCookie, setAuthCookie] = useState<Cookies.Cookie>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const getAuthCookie = async () => {
    const authCookie = (await browser.storage.local.get("authCookie"))[
      "authCookie"
    ];

    console.log(authCookie);

    if (authCookie) {
      setAuthCookie(authCookie);
      setIsAuthenticated(authCookie.length > 0);
    }
  };

  useEffect(() => {
    getAuthCookie();

    const listener = (
      changes: Record<string, Storage.StorageChange>,
      areaName: string
    ) => {
      if (areaName === "local" && "authCookie" in changes) {
        if (changes["authCookie"].newValue) {
          setAuthCookie(changes["authCookie"].newValue);
          setIsAuthenticated(true);
        } else {
          setAuthCookie(undefined);
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
    <AuthContext.Provider value={{ token: authCookie, setToken: setAuthCookie, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
