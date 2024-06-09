'use client';
import React from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import firebase_app from '../firebase/config';
import { Spinner } from '@nextui-org/react';

const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? (
        <Spinner
          className="flex justify-center text-4xl h-screen w-screen"
          color="primary"
        >
          Loading
        </Spinner>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
