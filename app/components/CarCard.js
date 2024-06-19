
import React from 'react';
import Image from 'next/image';


import { Button } from '@nextui-org/react';
const CarCard = async () => {

const getVechicles= async ()=>{
  
  
  const res = await fetch ('http://localhost:3000/api')
  return res.json()

}

const data= await getVechicles()

console.log(data)

  return (
  
    <div className="flex flex-col p-6 justify-center items-start text-black-100 bg-gray-200 hover:bg-white hover:shadow-md rounded-3xl w-[500px] m-5">
    {data.map((vechicle)=>(   

      
      <div className="w-full flex flex-col justify-between items-start gap-3" key={vechicle.id}>
        <h2 className="text-[22px] leading-[26px] font-bold capitalize text-black">
         {vechicle.model}
        </h2>
        <p>
          <span className="self-start text-[24px] font-semibold text-black">
          
          </span>
        </p>
        <div className="relative w-full h-40 my-3 object-contain">
          <Image
            src={'/carex.png'}
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
              {/* <p className="text-[14px] text-gray-400">
                {transmission === 'a' ? 'Automatic' : 'Manual'}
              </p> */}
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <Image
                src="/tire.svg"
                alt="steering wheel"
                width={20}
                height={20}
              />
              <p className="text-[14px] text-gray-400"></p>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <Image
                src="/gas.svg"
                alt="steering wheel"
                width={20}
                height={20}
              />
              <p className="text-[14px] text-gray-400"> MPG</p>
            </div>
            
          </div>
          
          <div className=" flex justify-center ml-4 pl-4">
            <Button variant="ghost" color="primary" className="text-black">
              Add to Profile
            </Button>
        
          </div>
          
        </div>
       
      
      </div>
    ))}
    </div>
    
   
  );
};

export default CarCard;
