'use client';
import React from 'react';
import NavBar from '../components/navbar';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { CarCard } from '../components';
const VehicleSelection = () => {
  const { data: session } = useSession();
  if (!session) {
    return <p>Access Denied</p>;
  }
  return (
    <div>
      <NavBar />
      <div className="pt-[80px]">
        <CarCard/>
      </div>
    </div>
  );
};

export default VehicleSelection;
