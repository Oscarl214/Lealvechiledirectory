'use client';
import React, { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Button } from '@nextui-org/react';
import Link from 'next';
import { useRouter } from 'next/navigation';
import logOut from '../firebase/auth/logout';
import NavBar from '../components/navbar';
import { CustomFilter, SearchBar } from '../components/index';

const AdminView = () => {
  const { user } = useAuthContext();

  useEffect(() => {
    if (user == null) {
      // Perform client-side navigation using Link
      document.location.href = '/';
    }
  }, [user]);

  return (
    <div className="bg-gray-300  min-h-screen">
      <NavBar />
      <div className="relative  ">
        <div className="absolute top-[350px] .animation-delay-2000  -left-[-700px] w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob"></div>
        <div className="absolute top-[350px] animation-delay-4000 -right-[-700px] w-72 h-72 opacity-80 bg-red-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute  animation-delay-2000 -bottom-[-300px] left-[825px] w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob"></div>
        <div className="flex flex-col items-center justify-center min-h-screen ">
          <div className="home__filters">
            <SearchBar />
            <div className="home__filter_container">
              <CustomFilter title="fuel" />
              <CustomFilter title="year" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
