import { createContext, useEffect, useState } from "react";
import { URL_API } from '../config/URL';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await fetch(URL_API + '/login', {
      method: 'POST',
      body: JSON.stringify(inputs),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.status === 200) {
      const data = await res.json()
      setCurrentUser(data);
    }

    return res.status;
    
  };

  const logout = async (inputs) => {
    toast.success('SESION CERRADA!');
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
