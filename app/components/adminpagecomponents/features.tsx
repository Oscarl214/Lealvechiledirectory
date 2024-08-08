import React from 'react';
import { Card, Image, Button } from '@nextui-org/react';
import FeaturesData from './featuresData.json';
import Link from 'next/link';

const Features = () => {
  return (
    <div className="div-feature mb-[80px]">
      <div className="flex flex-wrap justify-center gap-3 lg:gap-8 m-3">
        {FeaturesData.map((feature) => (
          <div
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            key={feature.id}
          >
            <Image className="rounded-t-lg" src={feature.image} alt="" />

            <div className="p-5">
              <h5 className="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {feature.title}
              </h5>

              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {feature.description}
              </p>
              <Link href={'/vehicleselection'}>
                <Button className="button">Browse Vehicles</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
