'use client';
import React, { useState, useEffect } from 'react';
import { Button, Divider } from '@nextui-org/react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import Loading from '@/app/profile/loading';
interface HistoryButtonProps {
  vehicle: any;
  refreshMaintenanceData: (vehicleId: string) => void;
}

const HistoryButton: React.FC<HistoryButtonProps> = ({
  vehicle,
  refreshMaintenanceData,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [maintenance, setMaintenance] = React.useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const fetchMaintenanceData = async () => {
    try {
      const response = await fetch('/api/callMaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cache: 'no store',
        },
        body: JSON.stringify({
          vehicleId: vehicle.id,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setMaintenance(data.maintenanceData);
        refreshMaintenanceData(vehicle.id);
        onOpen();
      } else {
        console.error('Failed to fetch maintenance data');
        setError('Error fetching maintenance data');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching maintenance data');
    } finally {
      setLoading(false);
    }
  };
  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <div>
      <Button
        className="bg-orange-500 hover:bg-blue-500 text-center"
        onPress={fetchMaintenanceData}
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
              <ModalBody className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
                {maintenance.map((maintenance) => (
                  <div className="flex flex-col gap-4 " key={maintenance.id}>
                    <div className="p-4 rounded-md bg-gray-100 shadow-md dark:bg-gray-800 ">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700 dark:text-white">
                          Maintenance Type:
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {maintenance.type}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold text-gray-700 dark:text-white">
                          Task/Comment:
                        </span>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {maintenance.description}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold text-gray-700 dark:text-white">
                          Date Posted:
                        </span>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {maintenance.date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
