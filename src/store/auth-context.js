import React,{useState, useEffect, useCallback} from "react";

let logoutTimer;

const AuthContext =React.createContext({
    token:'',
    isLoggedIn: false,
    login: (token)=>{},
    logout: ()=>{}
});

const calculateRemainingTime = (expirationTime) =>{
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingTime = adjExpirationTime - currentTime;

    return remainingTime;
};

const retriveStoredToken =()=>{
    const storedToken = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(expirationTime);

    if(remainingTime <= 60000) //60000 milli second tends to one minute
    {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    }

    return {
        token:storedToken,
        duration: remainingTime
    };
};


export const AuthContextProvider =(props)=>{
    const tokenData = retriveStoredToken();
    let initialToken;
    if(tokenData)
    {
        initialToken = tokenData.token;
    }
    // initialToken = localStorage.getItem('token');
    const [token, setToken] = useState(initialToken);

    const logoutHandler=useCallback(()=>{
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        if(logoutTimer)
        {
            clearTimeout(logoutTimer);
        }
    },[]);

    const loginHandler=(token,expirationTime)=>{
        setToken(token);
        localStorage.setItem('token',token);
        localStorage.setItem('expirationTime',expirationTime);
        const remainingTime = calculateRemainingTime(expirationTime);

        logoutTimer =setTimeout(logoutHandler,remainingTime);
    };

    useEffect(()=>{
        if(tokenData)
        {
            console.log(tokenData.duration);
            logoutTimer =setTimeout(logoutHandler,tokenData.duration);
        }
    },[tokenData,logoutHandler]);


    const contextValue = {
        token,
        isLoggedIn: !!token,
        login:loginHandler,
        logout:logoutHandler
    };
    

    return(
        <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
    );
};

export default AuthContext;