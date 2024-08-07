import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
  Divider,
  Link,
} from '@nextui-org/react';
import FeaturesData from './featuresData.json';
const Features = () => {
  return (
    <div className="div-feature ">
      <div className="flex flex-row justify-center gap-8 lg:flex-nowrap md:flex-nowrap flex-wrap">
        {FeaturesData.map((feature) => (
          <Card
            className="w-[400px] h-[600px] bg-transparent border-2 border-blue-500"
            key={feature.id}
          >
            <CardHeader className="flex flex-col gap-3">
              <div className="flex flex-col">
                <h3 className="text-white font-bold text-lg md:text-xl lg:text-3xl leading-tight">
                  {feature.title}
                </h3>
              </div>
              <span className={feature.svg} />
            </CardHeader>
            <Divider className="bg-white" />
            <CardBody className="overflow-hidden">
              <p className="lg:text-xl md:text-md text-lg">
                {feature.description}
              </p>
              <div className="flex justify-center items-center m-2">
                <Image
                  isBlurred
                  src="https://images.pexels.com/photos/1454253/pexels-photo-1454253.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="NextUI Album Cover"
                  className=""
                />
              </div>
            </CardBody>
            <Divider />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Features;
