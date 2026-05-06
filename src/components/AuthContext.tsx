import { createContext, useContext, useState } from "react";

interface AuthContextType {
    token: string | null;
    setToken: (t: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: () => { },
});

export const AuthProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    const updateToken = (t: string | null) => {
        setToken(t);
        if (t) localStorage.setItem("token", t);
        else localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ token, setToken: updateToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);