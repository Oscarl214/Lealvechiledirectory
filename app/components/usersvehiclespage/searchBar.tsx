import React, { useState } from 'react';
import maintenanceData from '../../maintenanceData.json'; // Adjust the path if necessary
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';

const SearchBar = () => {
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
        <Card className="w-[300px] h-auto">
          <div className="flex flex-col">
            <CardHeader>
              <label
                htmlFor="maintenance-type"
                className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select Maintenance Category
              </label>
            </CardHeader>
            <Divider />
            <CardBody>
              <select
                id="maintenance-type"
                className="mb-4 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
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

              {tasks.length > 0 && (
                <ul className="list-disc pl-5 marker:text-blue-500">
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
          <div className="relative w-full mt-4">
            <input
              type="search"
              id="location-search"
              className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
              placeholder="Search for city or address"
              required
            />
            <button
              type="submit"
              className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <span className="sr-only">Search</span>
            </button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default SearchBar;