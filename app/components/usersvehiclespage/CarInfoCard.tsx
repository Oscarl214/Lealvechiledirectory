'use client';
import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from '@nextui-org/react';

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

interface CarInfoCardProps {
  vehicle: Vehicle;
}
const CarInfoCard: React.FC<CarInfoCardProps> = ({ vehicle }) => {
  return (
    <div>
      <Card className="w-[300px] h-[50px] hover:h-full text-black bg-slate-500 ">
        <CardHeader className="flex gap-3 justify-center">
          <div className="flex ">
            <p className="text-md font-bold text-white">Vehicle Information</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p></p>
          <ul className="font-sans list-disc list-inside">
            <li className="p-1 marker:text-[#0077ff]">
              <a className="font-bold">Fuel Type: </a>
              {vehicle.fuel_type}
            </li>
            <li className="p-1 marker:text-[#0077ff]">
              <a className="font-bold">Drive: </a>
              {vehicle.drive}
            </li>
            <li className="p-1 marker:text-[#0077ff]">
              <a className="font-bold">Transmission: </a>
              {vehicle.transmission}
            </li>
            <li className="p-1 marker:text-[#0077ff]">
              <a className="font-bold">Cylinders: </a>
              {vehicle.cylinders}
            </li>
            <li className="p-1 marker:text-[#0077ff]">
              <a className="font-bold">Displacement: </a>
              {vehicle.displacement}
            </li>
            <li className="p-1 marker:text-[#0077ff]">
              <a className="font-bold">City MPG: </a>
              {vehicle.city_mpg ?? 'N/A'}
            </li>

            <li className="p-1 marker:text-[#0077ff]">
              <a className="font-bold">HighWay MPG: </a>
              {vehicle.highway_mpg ?? 'N/A'}
            </li>
            <li className="p-1 marker:text-[#0077ff]">
              <a className="font-bold">Combination MPG: </a>
              {vehicle.combination_mpg ?? 'N/A'}
            </li>
          </ul>
        </CardBody>
        <Divider />
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default CarInfoCard;
