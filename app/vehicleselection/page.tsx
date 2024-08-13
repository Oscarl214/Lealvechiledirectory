'use client';
import React from 'react';
import NavBar from '../components/navbar';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { CarCard } from '../components';
import { Suspense } from 'react';
import Loading from '../loading';
const VehicleSelection = () => {
  const { data: session } = useSession();
  if (!session) {
    return <p>Access Denied</p>;
  }
  return (
    <div>
      <NavBar />
      <div className="pt-[80px]">
        <Suspense fallback={<Loading />}>
          <CarCard />
        </Suspense>
      </div>
    </div>
  );
};

export default VehicleSelection;
