import axios from "axios";
import { createContext, useState, useEffect } from "react";

import { toast } from "react-toastify";

export const AppContext = createContext();

axios.defaults.withCredentials = true;

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async() => {
    try{
      const{data} = await axios.get(backendUrl + '/api/auth/is-auth', { withCredentials: true });
      if(data.success){
        setIsLoggedIn(true)
        getUserData();
      }
    }catch(error){
      toast.error(error.message);
    }
  }

  const getUserData = async() => {

    try{
      const {data} = await axios.get(backendUrl + '/api/user/data', { withCredentials: true });
      data.success ?  setUserData(data.userData) : toast.error(data.message)
    }catch(error){
  toast.error(error.message);
}

  }

  useEffect(() => {
    getAuthState()
  }, [])
  

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
