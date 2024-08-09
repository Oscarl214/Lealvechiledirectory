'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@nextui-org/react';

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

const CarCard = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch('/api/vehicles');
        const data = await response.json();

        console.log('All Vehicle Data', data);
        setVehicles(data.CarData);
      } catch (error) {
        console.error('Error fetching car data', error);
      }
    };
    fetchCarData();
  }, []);

  return (
    <div className="flex flex-wrap justify-center">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="flex flex-col p-6 justify-center items-start text-black-100 bg-gray-500 hover:bg-white hover:shadow-md rounded-xl md:w-[500px] w-[300px] m-5 flex-wrap"
        >
          <div className="w-full flex flex-col justify-between items-start gap-3">
            <h2 className="text-[22px] leading-[26px] font-bold capitalize text-white">
              {vehicle.model}
            </h2>
            <p>
              <span className="self-start text-[24px] font-semibold text-black">
                {vehicle.make} {vehicle.year}
              </span>
            </p>
            <div className="relative w-full h-40 my-3 flex items-center justify-center">
              {vehicle.image ? (
                <Image
                  src={vehicle.image}
                  alt="car model"
                  height={250}
                  width={270}
                  priority
                  className="object-center"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-300">
                  <p>No image available</p>
                </div>
              )}
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
                    alt="drive type"
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
                    alt="fuel efficiency"
                    width={22}
                    height={21}
                  />
                  <p className="text-[14px] text-gray-700 mt-3">
                    {vehicle.highway_mpg} MPG
                  </p>
                </div>
              </div>

              <div className=" lg:flex-row flex-col lg:justify-center lg:ml-4 lg:pl-4 items-start mt-4">
                <Button className="button">My Vehicles</Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarCard;
