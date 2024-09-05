import React, { useState } from 'react';
import maintenanceData from '../../maintenanceData.json'; // Adjust the path if necessary
import { Card, CardBody, CardHeader, Divider, Button } from '@nextui-org/react';

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
        <Card className="w-[375px] h-auto">
          <div className="flex flex-col">
            <CardHeader>
              <label
                htmlFor="maintenance-type"
                className="mb-2 text-md font-medium text-gray-900 dark:text-white"
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
          <form>
            <label
              htmlFor="maintenance-type"
              className=" m-2 mb-2 text-md font-medium text-gray-900 dark:text-white"
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
              className=" m-2 mb-2 text-md font-medium text-gray-900 dark:text-white"
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
      </form>
    </div>
  );
};

export default SearchBar;
