import { LayoutProps } from "@/types";
import { createContext } from "react";

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
    const authToken = (await browser.storage.local.get("authToken"))["authToken"];
    if (authToken) {
      setToken(authToken);
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    getAuthToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
