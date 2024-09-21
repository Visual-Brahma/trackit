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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    token.length > 0
  );

  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
