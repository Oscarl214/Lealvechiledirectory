'use client';
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Divider, Button } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import Mtypes from './Mtypes';

interface SearchBarProps {
  vehicleid: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ vehicleid }) => {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmission = async () => {
    if (!type) {
      toast.error('Please input a type of maintenance');
      return;
    }
    if (!description) {
      toast.error('Please input a task or comment');
      return;
    }

    try {
      let response = await fetch('/api/addMaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          description,
          vehicleId: vehicleid,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Maintenance added successfully', result);
        toast.success('Maintenance added successfully');
        setType('');
        setDescription('');
      } else {
        console.error('Failed to add maintenance');
        toast.error('Failed to add maintenance');
      }
    } catch (error) {
      console.error('Error submitting maintenance:', error);
    }
  };
  return (
    <div>
      <Mtypes />
      <Divider className="mt-3" />
      <Card className="mt-3">
        <form>
          <CardHeader>
            <h2 className="font-semibold text-3xl text-white text-center">
              Maintenance Form
            </h2>
          </CardHeader>
          <label
            htmlFor="maintenance-type"
            className=" m-4 mb-2 text-md font-medium text-gray-900 dark:text-white"
          >
            Enter your Maintenance Type
          </label>
          <input
            type="text"
            className="block p-2.5 rounded-md w-auto m-4 z-20 text-sm text-gray-900 bg-gray-50 border-s-gray-50  border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="Engine"
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <label
            htmlFor="maintenance-type"
            className=" m-4 mb-2 text-md font-medium text-gray-900 dark:text-white"
          >
            Enter the Task or add a comment
          </label>
          <textarea
            rows={4}
            maxLength={200}
            className="block p-2.5 w-[350px] m-4 rounded-md  z-20 text-sm text-gray-900 bg-gray-50 border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="Oil Change, 09/12/2024, Miles at 45,909"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            className="bg-blue-500 hover:bg-orange-500 m-4"
            onClick={handleSubmission}
          >
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SearchBar;
