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

import {
  Modal,
  ModalContent,
  ModalHeader,
  Button,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';

const CarInfoCard: React.FC<CarInfoCardProps> = ({ vehicle }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div>
      <Button onPress={onOpen} className="bg-blue-500 hover:bg-orange-500">
        Vehicle Information
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Vehicle Specs
              </ModalHeader>
              <Divider />
              <ModalBody className="">
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
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CarInfoCard;
