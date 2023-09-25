import React,{ useState, useContext, createContext } from 'react';

const AuthContext = createContext();

export function AuthProvider ({children}) {

    const [user,setUser] = useState(null);
    // const [token, setToken] = useState(null);
    // const [tokenExpiration, setTokenExpiration] = useState(null);

    const login = async (data) => { 
        // setUser({username:"something", token:"something", tokenExpiration:"something"});
        console.log(data.data);
        setUser(() => ({
            userId : data.data.login.userId,
            token : data.data.login.token,
            tokenExpiration : data.data.login.tokenExpiration

        }));
    }

    const logout = ()=> {
        setUser(null);
    }


    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext);
}
