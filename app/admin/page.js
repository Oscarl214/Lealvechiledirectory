'use client'
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
    <div className='bg-[#E5E5E5] bg-opacity-25 min-h-screen'>
      <NavBar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <form className="max-w-md">   
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input type="search" id="default-search" className="block w-full p-4 pl-[4rem] pr-[4rem] text-lg text-gray-900 border border-gray-300 rounded-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Car Model" required />
            <button type="submit" className="text-white underline absolute end-2.5 bottom-2.5 bg-trasnparent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-trasnparent dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminView;
