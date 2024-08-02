'use client';
import React, { useState, useEffect } from 'react';
import { firebase_app } from '../firebase/config';
import { getAuth } from 'firebase/auth';
import { getUsersVehicle } from '@/utils';
import Link from 'next/link';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  fuel_type: string;
  drive: string;
  transmission: string;
  cylinders: number;
  displacement: number;
  highway_mpg: number;
  combination_mpg: number;
  city_mpg: number;
  class: string;
  image: string;
}

const UsersCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const auth = getAuth(firebase_app);

  const user = auth.currentUser;
  console.log('this is the user that is logged in', user);
  const handleGetCars = async () => {
    if (user) {
      try {
        const userCars = await getUsersVehicle(user.uid);
        setCars(userCars);
      } catch (error) {
        console.log('Error retreveing user vechicles:', error);
      }
    } else {
      console.log('User not authenticated');
    }
  };

  useEffect(() => {
    handleGetCars(), [user];
  }, []);

  return (
    <div>
      {cars.length > 0 ? (
        <ul>
          {cars.map((car, index) => (
            <li key={index}>
              <p>Make: {car.make}</p>
              <p>Model: {car.model}</p>
              <p>Year: {car.year}</p>
              <p>Transmission: {car.transmission}</p>
              <p>Drive: {car.drive}</p>
              <p>MPG (City): {car.city_mpg}</p>
              <p>MPG (Highway): {car.highway_mpg}</p>
              <p>Fuel Type: {car.fuel_type}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No cars found</p>
      )}
      <div>
        <Link href="/admin">Back to Cars</Link>
      </div>
    </div>
  );
};

export default UsersCars;
