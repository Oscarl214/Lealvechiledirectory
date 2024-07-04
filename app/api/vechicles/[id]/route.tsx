import { NextResponse } from 'next/server';

const vechicles:  any = [

    {
        id: 1,
        make: "Chevrolet",
        model: "Silverado",
        year: 2021,
        fuel_type: "gas",
        drive: "rwd",
        transmission: "a",
        cylinders: 8,
        displacement: 5.3,
        city_mpg: 17,
        highway_mpg: 23,
        combination_mpg: 19,
        class: "pickup",
        image:"https://lealdirectory.s3.us-east-2.amazonaws.com/Chevy_Silverado-removebg-preview.png"
      },
      {
        id: 2,
        make: "Toyota",
        model: "4Runner",
        year: 2019,
        fuel_type: "gas",
        drive: "4wd",
        transmission: "a",
        cylinders: 6,
        displacement: 4.0,
        city_mpg: 17,
        highway_mpg: 20,
        combination_mpg: 18,
        class: "SUV", 
        image: "https://lealdirectory.s3.us-east-2.amazonaws.com/4Runner.png"
      },
      {
        id: 3,
        make: "Toyota",
        model: "Camry",
        year: 2018,
        fuel_type: "gas",
        drive: "front-wheel drive",
        transmission: "automatic",
        cylinders: 4,
        displacement: 2.5,
        city_mpg: 29,
        highway_mpg: 41,
        combination_mpg: 34,
        class: "mid-size car",
        image: "https://lealdirectory.s3.us-east-2.amazonaws.com/ToyotaCamry-removebg-preview.png"
      },
      {
        id: 4,
        make: "Jeep",
        model: "Grand Cherokee",
        year: 2021,
        fuel_type: "gas",
        drive: "four-wheel drive",
        transmission: "automatic",
        cylinders: 6,
        displacement: 3.6,
        city_mpg: 18,
        highway_mpg: 25,
        combination_mpg: 21,
        class: "SUV",
        image: "https://lealdirectory.s3.us-east-2.amazonaws.com/jeep-removebg-preview.png"
      },
      {
        id: 5,
        make: "Volkswagen",
        model: "Atlas",
        year: 2021,
        fuel_type: "gas",
        drive: "front-wheel drive",
        transmission: "automatic",
        cylinders: 4,
        displacement: 2.0,
        city_mpg: 21,
        highway_mpg: 24,
        combination_mpg: 22,
        class: "mid-size SUV",
        image: "https://lealdirectory.s3.us-east-2.amazonaws.com/VWAtlas-removebg-preview.png"
      }
      

]

export async function GET(request: Request, context: any) {
    const { params } = context;
  
    return NextResponse.json({
      vechicle: vechicles.find((x: any) => x.id.toString() === params.id),
    });
  }
  