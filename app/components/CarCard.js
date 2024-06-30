import React from 'react';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { Button } from '@nextui-org/react';
import VechicleData from '../vechicleData.json'
const CarCard = async () => {
  // const _cookies = cookies();

  // const getVehicles = async () => {
  //   try {
  //     const res = await fetch('http://localhost:3000/api', {
  //       cache: 'force-cache',
  //     });
  //     if (!res.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     console.log(res);
  //     return res.json();
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     return []; // or handle error state
  //   }
  // };

const data = await VechicleData

  console.log(data)

  return (
    <div>
      {data.map((vechicle) => (
        <div
          className="flex flex-col p-6 justify-center items-start text-black-100 bg-gray-200 hover:bg-white hover:shadow-md rounded-3xl w-[500px] m-5"
          key={vechicle.id}
        >
          <div className="w-full flex flex-col justify-between items-start gap-3">
            <h2 className="text-[22px] leading-[26px] font-bold capitalize text-black">
              {vechicle.model}
            </h2>
            <p>
              <span className="self-start text-[24px] font-semibold text-black"></span>
            </p>
            <div className="relative w-full h-40 my-3 object-contain">
              <Image
                src={vechicle.image}
                alt="car model"
      fill
                className="object-contain w-fill"
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
                {vechicle.transmission === 'a' ? 'Automatic' : 'Manual'}
              </p>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <Image
                    src="/tire.svg"
                    alt="steering wheel"
                    width={20}
                    height={20}
                  />
                  <p className="text-[14px] text-gray-400">{vechicle.drive}</p>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <Image
                    src="/gas.svg"
                    alt="steering wheel"
                    width={20}
                    height={20}
                  />
                  <p className="text-[14px] text-gray-400"> {vechicle.highway_mpg} MPG</p>
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
      ))}
    </div>
  );
};

export default CarCard;
