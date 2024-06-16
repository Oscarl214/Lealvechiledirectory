'use client';
import React from 'react';
import { useState } from 'react';
import { CarProps } from '../types';
import Image from 'next/image';
interface CarCardProps {
  car: CarProps;
}
const CarCard = ({ car }: CarCardProps) => {
  const { city_mpg, year, make, model, transmission, drive } = car;
  return (
    <div className="flex flex-col p-6 justify-center items-start text-black-100 bg-primary-blue-100 hover:bg-white hover:shadow-md rounded-3xl">
      <div className="w-full flex flex-col justify-between items-start gap-2">
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
            src="/carex.png"
            alt="car model"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default CarCard;
