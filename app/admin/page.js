'use client';

import React, { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Button } from '@nextui-org/react';
import Link from 'next';
import { useRouter } from 'next/navigation';
import logOut from '../firebase/auth/logout';
import NavBar from '../components/navbar';


const AdminView = () => {
  const { user } = useAuthContext();

  useEffect(() => {
    if (user == null) {
      // Perform client-side navigation using Link
      document.location.href = '/';
    }
  }, [user]);


  return (
    <div className='bg-[#E5E5E5] bg-opacity-25 h-screen w-screen'>
      <NavBar/>
      <h1>Only logged-in users can view this page</h1>
     
    </div>
  );
};

export default AdminView;
