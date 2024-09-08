'use client';
import React, { useState, useEffect } from 'react';
import UsersCar from '../components/usersvehiclespage/UsersCar';
import NavBar from '../components/navbar';
import { Suspense } from 'react';
import Loading from './loading';
import Link from 'next/link';
import { Button, Spinner } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
const Profile = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Link href="/">
          <Spinner size="lg" />
        </Link>
      </div>
    );
  }
  return (
    <div>
      <NavBar />
      <div className="">
        <UsersCar />
      </div>
    </div>
  );
};

export default Profile;
