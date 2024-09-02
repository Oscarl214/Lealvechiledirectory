'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import CarInfoCard from './CarInfoCard';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  fuel_type: string;
  drive: string;
  transmission: string;
  cylinders: number;
  displacement: number;
  city_mpg: number | null;
  highway_mpg: number | null;
  combination_mpg: number | null;
  class: string;
  image: string;
  userId: string | null;
  user: string | null;
}

const UsersCar = () => {
  const { data: session, status } = useSession();
  const [userVehicles, setUserVehicles] = useState<Vehicle[] | null>(null);

  useEffect(() => {
    if (!session?.user?.email) return;

    const getUsersVehicles = async () => {
      try {
        const response = await fetch('/api/uservehicles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            cache: 'no-store',
          },
          body: JSON.stringify({ email: session.user.email }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Car data', data);
          if (
            data &&
            data.userCarData &&
            Array.isArray(data.userCarData.vehicles)
          ) {
            setUserVehicles(data.userCarData.vehicles);
          } else {
            console.error('Invalid data structure:', data);
          }
        } else {
          console.error('Failed to fetch vehicles');
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    getUsersVehicles();
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!userVehicles || userVehicles.length === 0) {
    return <div>No vehicles found</div>;
  }

  return (
    <div className="mt-10 flex flex-wrap h-screen bg-white">
      {userVehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="flex flex-col md:flex-row w-full p-4 items-center"
        >
          {/* Car image */}
          <div className="flex-shrink-0 md:w-1/2 mb-4 md:mb-0">
            <h2 className="text-center mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl ">
              {vehicle.make} {vehicle.model}
            </h2>
            <Image
              src={vehicle.image}
              alt={`${vehicle.make} ${vehicle.model} (${vehicle.year})`}
              height={550}
              width={570}
              priority
              className="object-cover w-full h-auto"
            />
          </div>
          <div className="flex-grow md:w-1/2 flex justify-center items-center">
            <CarInfoCard vehicle={vehicle} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersCar;
