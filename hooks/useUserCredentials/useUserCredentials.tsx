import {createContext, useContext, useState, Dispatch, SetStateAction} from "react";

const UserCredentialsContext = createContext({
    verifiedLogin: '',
    setVerifiedLogin: (login: string) => {},
    verifiedPassword: '',
    setVerifiedPassword: (password: string) => {},
    token: '',
    setToken: (token: string) => {}
});

export function useUserCredentials () {
    return useContext(UserCredentialsContext);
}

export default function UserCredentialsProvider({children}: any) {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    return (
        <UserCredentialsContext.Provider value={{
            verifiedLogin: login,
            setVerifiedLogin: setLogin,
            verifiedPassword: password,
            setVerifiedPassword: setPassword,
            token: token,
            setToken: setToken
        }}>
            {children}
        </UserCredentialsContext.Provider>
    )
}