'use client';
import React from 'react';
import NavBar from '../components/navbar';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
const VehicleSelection = () => {
  const { data: session } = useSession();
  if (!session) {
    return <p>Access Denied</p>;
  }
  return (
    <div>
      <NavBar />
      <div className="pt-[80px]">
        <p>Car Cards will go here</p>
      </div>
    </div>
  );
};

export default VehicleSelection;
