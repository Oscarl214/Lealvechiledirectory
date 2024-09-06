'use client';
import React from 'react';
import { Button, Divider } from '@nextui-org/react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
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

const HistoryButton: React.FC<CarInfoCardProps> = ({ vehicle }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button
        className="bg-orange-500 hover:bg-blue-500 text-center"
        onPress={onOpen}
      >
        Maintenance History
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                Maintenance History for {vehicle.make} {vehicle.model}
              </ModalHeader>
              <Divider />
              <ModalBody className="flex flex-col gap-4">
                {/* Replace with dynamic fetch for maintenance history */}
                <div className="flex flex-col gap-4">
                  {/* Example maintenance card */}
                  <div className="p-4 rounded-md bg-gray-100 shadow-md dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700 dark:text-white">
                        Maintenance Type:
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Engine
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold text-gray-700 dark:text-white">
                        Task/Comment:
                      </span>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Oil Change, 09/12/2024, Miles at 45,909
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold text-gray-700 dark:text-white">
                        Date Posted:
                      </span>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        09/24/2024
                      </div>
                    </div>
                  </div>
                </div>
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

export default HistoryButton;
