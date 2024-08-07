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
      <div className="flex flex-row justify-center lg:gap-8 md:gap-8 gap-3 lg:flex-nowrap md:flex-wrap flex-wrap lg:m-0 md:m-0 mt-[60px]">
        {FeaturesData.map((feature) => (
          <Card
            className="lg:w-[400px] md:w-[400px] lg:h-[300px] md:h-[300px] h-[250px] w-auto  bg-transparent border-2 border-blue-500 m-3"
            key={feature.id}
          >
            <CardHeader className="flex flex-col gap-3">
              <div className="flex flex-col">
                <h3 className="text-white font-bold text-lg md:text-xl lg:text-3xl leading-tight">
                  {feature.title}
                </h3>
              </div>
            </CardHeader>
            <Divider className="bg-blue-500" />
            <CardBody className="overflow-hidden bg-white text-black">
              <p className="lg:text-xl md:text-md text-md text-black">
                {feature.description}
              </p>
              {/* <div className="flex justify-center items-center m-2">
                <Image
                  isBlurred
                  src="https://images.pexels.com/photos/1454253/pexels-photo-1454253.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="NextUI Album Cover"
                  className=""
                />
              </div> */}
            </CardBody>
            <Divider className="bg-blue-500" />
            <CardFooter className="flex justify-center">
              <span className="icon-[iconoir--tools] text-blue-500 text-6xl" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Features;
