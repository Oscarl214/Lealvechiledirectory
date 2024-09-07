'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Divider, Button } from '@nextui-org/react';
import maintenanceData from '../../maintenanceData.json';

const Mtypes = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);

  const maintenanceCategories = maintenanceData.maintenanceTypes.map(
    (item) => item.category
  );

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);

    const selectedMaintenance = maintenanceData.maintenanceTypes.find(
      (item) => item.category === selectedCategory
    );

    setTasks(selectedMaintenance ? selectedMaintenance.tasks : []);
  };

  return (
    <div>
      <form className="max-w-md mx-auto">
        <Card className="w-[375px] h-auto">
          <div className="flex flex-col">
            <CardHeader>
              <label
                htmlFor="maintenance-type"
                className="mb-2 font-semibold underline text-md font-medium text-gray-900 dark:text-white"
              >
                Select Maintenance Category
              </label>
            </CardHeader>
            <Divider />
            <CardBody>
              <select
                id="maintenance-type"
                className="mb-4 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500 "
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">Select a category</option>
                {maintenanceCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Divider />
              <h3 className="text-white font-semibold underline">Tasks:</h3>
              {tasks.length > 0 && (
                <ul className="list-disc pl-5 marker:text-blue-500 mt-2">
                  {tasks.map((task, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-800 dark:text-gray-200"
                    >
                      {task}
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default Mtypes;
