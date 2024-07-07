'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '@nextui-org/react';
import VechicleData from '../vechicleData.json';
import Link from 'next/link';
import { getAuth } from 'firebase/auth';
import { addVehicleToProfile } from '@/utils';

import { firebase_app } from '../firebase/config';
const CarCard = () => {
  const data = VechicleData;
  const auth = getAuth(firebase_app);
  const user = auth.currentUser;

    console.log("this is the user that is logged in", user)
  const handleAddVehicle = async (vehicle) => {
    if (user) {
      await addVehicleToProfile(user.uid, vehicle);
    } else {
      console.log('User not authenticated');
    }
  };
  return (
    <div className="flex flex-wrap justify-center">
      {data.map((vehicle) => (
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
                width={250}
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
                <div className="flex flex-col justify-center items-center gap-2">
                  <Image
                    src="/gas.svg"
                    alt="steering wheel"
                    width={20}
                    height={20}
                  />
                  <p className="text-[14px] text-gray-700 mt-3">
                    {' '}
                    {vehicle.highway_mpg} MPG
                  </p>
                </div>
              </div>

              <div className=" lg:flex-row flex-col lg:justify-center lg:ml-4 lg:pl-4   items-start mt-4">
                <Link href={`/cardetails/${vehicle.id}`}>
                  <Button
                    className="text-black hover:bg-black hover:text-white"
                    onClick={() => handleAddVehicle(vehicle)}
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
