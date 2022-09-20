import React, { createContext, useState, ReactElement, FC } from "react";

type AuthContextType = {
    auth?: {
        username?: string,
        accessToken?: string,
    },    
    setAuth?: React.SetStateAction<{}>
}

type Props = {
    children: ReactElement
}

const AuthContext = createContext<AuthContextType>({});

export const AuthProvider: FC<Props> = ({ children}) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
