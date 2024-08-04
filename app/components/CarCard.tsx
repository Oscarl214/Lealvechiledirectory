'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAuth } from 'firebase/auth';
import { Button } from '@nextui-org/react';
import { getFunctions, httpsCallable } from 'firebase/functions';

const CarCard = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchCarsData = async () => {
      try {
        const response = await getAllCarsData();
        setVehicles(response.data.vehicles);
      } catch (error) {
        console.log('Error fetching vehicles', error);
      }
    };

    fetchCarsData();
  }, []);

  const handleAddVehicle = async (vehicle) => {
    console.log('Attempting to call addVehicleToProfile with:', vehicle);

    if (user) {
      try {
        const response = await addVehicleToProfile({
          userId: user.uid,
          vehicle: vehicle,
        });
        console.log('Response from function:', response.data.message);
      } catch (error) {
        console.log('Error adding vehicle', error);
      }
    } else {
      console.log('User not authenticated');
    }
  };

  return (
    <div className="flex flex-wrap justify-center">
      {vehicles.map((vehicle) => (
        <div
          className="flex flex-col p-6 justify-center items-start text-black-100 bg-gray-200 hover:bg-white hover:shadow-md rounded-3xl md:w-[500px] w-[300px] m-5 flex-wrap"
          key={vehicle.id}
        >
          <div className="w-full flex flex-col justify-between items-start gap-3">
            <h2 className="text-[22px] leading-[26px] font-bold capitalize text-black">
              {vehicle.model}
            </h2>
            <p>
              <span className="self-start text-[24px] font-semibold text-black"></span>
            </p>
            <div className="relative w-full h-40 my-3 flex items-center justify-center">
              <Image
                src={vehicle.image}
                alt="car model"
                height={250}
                width={270}
                priority
                className="object-center "
              />
            </div>
            <div className="relative flex lg:flex-row w-full mt-2 flex-col">
              <div className="flex group-hover:invisible w-full justify-between text-gray ">
                <div className="flex flex-col justify-center items-center gap-2">
                  <Image
                    src="/steering-wheel.svg"
                    alt="steering wheel"
                    width={20}
                    height={20}
                  />
                  <p className="text-[14px] text-gray-700 mt-3">
                    {vehicle.transmission === 'a' ? 'Automatic' : 'Manual'}
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <Image
                    src="/tire.svg"
                    alt="steering wheel"
                    width={20}
                    height={20}
                  />
                  <p className="text-[14px] text-gray-700 mt-3">
                    {vehicle.drive}
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center gap-2 ">
                  <Image
                    src="/gas.svg"
                    alt="steering wheel"
                    width={22}
                    height={21}
                  />
                  <p className="text-[14px] text-gray-700 mt-3">
                    {vehicle.highway_mpg} MPG
                  </p>
                </div>
              </div>

              <div className=" lg:flex-row flex-col lg:justify-center lg:ml-4 lg:pl-4 items-start mt-4">
                <Link href={`/cardetails/?carID=${vehicle.id}`}>
                  <Button
                    className="text-black hover:bg-black hover:text-white"
                    onClick={() => handleAddVehicle(vehicle.id)}
                  >
                    Add to Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarCard;
