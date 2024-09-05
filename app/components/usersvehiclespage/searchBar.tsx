import React, { useState } from 'react';
import maintenanceData from '../../maintenanceData.json'; // Adjust the path if necessary
import { Card, CardBody, CardHeader, Divider, Button } from '@nextui-org/react';
import Mtypes from './Mtypes';
const SearchBar = () => {
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
          />
          <Button className="bg-blue-500 hover:bg-orange-500 m-4">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SearchBar;
