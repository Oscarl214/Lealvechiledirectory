'use client';

import React, { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Button } from '@nextui-org/react';
import Link from 'next';
import { useRouter } from 'next/navigation';
import logOut from '../firebase/auth/logout';

const AdminView = () => {
  const { user } = useAuthContext();

  useEffect(() => {
    if (user == null) {
      // Perform client-side navigation using Link
      document.location.href = '/';
    }
  }, [user]);

  const handleLogOut = async (event) => {
    event.preventDefault();

    const { result, error } = await logOut();

    if (error) {
      return console.log('Error logging user out', error);
    }
    console.log(result);
    return Router.push('/');
  };

  return (
    <div>
      <h1>Only logged-in users can view this page</h1>
      <Button onClick={handleLogOut}>Log Out</Button>
    </div>
  );
};

export default AdminView;
