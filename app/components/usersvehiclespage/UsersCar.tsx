'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import CarInfoCard from './CarInfoCard';
import Loading from '@/app/profile/loading';
import { Button, Divider } from '@nextui-org/react';
import Link from 'next/link';
import DeleteVehicleButton from './deleteButton';
import SearchBar from './searchBar';
import HistoryButton from './HistoryButton';
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
  const [loading, setLoading] = useState<boolean>(true);

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
      } finally {
        setLoading(false);
      }
    };

    getUsersVehicles();
  }, [session?.user?.email]);

  const deleteUserVehicle = async (vehicleId: string) => {
    try {
      const response = await fetch('/api/removevehicle', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          cache: 'no-store',
        },
        body: JSON.stringify({
          email: session?.user?.email,
          VehicleID: vehicleId,
        }),
      });

      if (response.ok) {
        setUserVehicles(
          (prevVehicles) =>
            prevVehicles?.filter((vehicle) => vehicle.id !== vehicleId) || null
        );
      } else {
        console.error('Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (!userVehicles || userVehicles.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="m-4">No vehicles found: Add A Vehicle</h2>
        <Link href="/vehicleselection">
          <Button className="bg-orange-500">Vehicles</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className=" flex flex-wrap h-screen ">
      {userVehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="flex flex-col  w-full p-4 items-center"
        >
          {/* Car image */}
          <div className="flex-shrink-0 md:w-1/2 mb-4 md:mb-0 mt-[50px]">
            <DeleteVehicleButton
              onClick={() => deleteUserVehicle(vehicle.id)}
            />
            <Image
              src={vehicle.image}
              alt={`${vehicle.make} ${vehicle.model} (${vehicle.year})`}
              height={550}
              width={570}
              priority
              className="object-cover w-full h-auto mt-5  bg-white"
            />
            <div className="flex md:flex-col flex-row gap-3 m-2 justify-center items-center">
              <h2 className="text-center mb-4 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl ">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
              <div className="flex flex-col gap-2">
                <CarInfoCard vehicle={vehicle} />
                <HistoryButton />
              </div>
            </div>
          </div>
          <Divider />
          <div className="flex flex-col mf:flex-col lg:flex-row   justify-center items-center flex-wrap gap-4 m-2">
            <h2 className="font-semibold text-3xl lg:text-4xl text-center">
              Guide to Maintenance Types
            </h2>
            <p className="text-md">
              Choose a maintenance type from the list to see the different tasks
              available for your vehicle. Then proceed to enter in the task that
              best fits what you had done to your vehicle or input anything youd
              like that best reflects the maintenance done.
            </p>
            <SearchBar />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersCar;
