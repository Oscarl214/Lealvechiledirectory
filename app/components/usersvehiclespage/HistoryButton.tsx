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
              <ModalHeader className="flex flex-col gap-1">
                Maintenance History
              </ModalHeader>
              <Divider />
              <ModalBody className="">
                My fetch for the maintenance using the vehicleID
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
