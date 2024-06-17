'use client';
import React from 'react';
import { useState } from 'react';
import { CarProps } from '../types';
import Image from 'next/image';
import { generateCarImageUrl } from '@/utils';
interface CarCardProps {
  car: CarProps;
}

import { Button } from '@nextui-org/react';
const CarCard = ({ car }: CarCardProps) => {
  const { city_mpg, year, make, model, transmission, drive } = car;
  return (
    <div className="flex flex-col p-6 justify-center items-start text-black-100 bg-gray-200 hover:bg-white hover:shadow-md rounded-3xl w-[500px] m-5">
      <div className="w-full flex flex-col justify-between items-start gap-3">
        <h2 className="text-[22px] leading-[26px] font-bold capitalize text-black">
          {make} {model}
        </h2>
        <p>
          <span className="self-start text-[24px] font-semibold text-black">
            {year}
          </span>
        </p>
        <div className="relative w-full h-40 my-3 object-contain">
          <Image
            src={generateCarImageUrl(car)}
            alt="car model"
            fill
            className="object-contain"
          />
        </div>
        <div className="relative flex w-full mt-2">
          <div className="flex group-hover:invisible w-full justify-between text-gray">
            <div className="flex flex-col justify-center items-center gap-2">
              <Image
                src="/steering-wheel.svg"
                alt="steering wheel"
                width={20}
                height={20}
              />
              <p className="text-[14px] text-gray-400">
                {transmission === 'a' ? 'Automatic' : 'Manual'}
              </p>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <Image
                src="/tire.svg"
                alt="steering wheel"
                width={20}
                height={20}
              />
              <p className="text-[14px] text-gray-400">{drive.toUpperCase()}</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <Image
                src="/gas.svg"
                alt="steering wheel"
                width={20}
                height={20}
              />
              <p className="text-[14px] text-gray-400">{city_mpg} MPG</p>
            </div>
          </div>
          <div className=" flex justify-center ml-4 pl-4">
            <Button variant="ghost" color="primary" className="text-black">
              Add to Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
