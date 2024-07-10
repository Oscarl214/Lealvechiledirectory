import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyIdToken } from '../../firebase/firebaseAdmin';
import Image from 'next/image';
import NavBar from '../../components/navbar';

async function getVechiclebyId(vechicleId: string) {
  const response = await fetch(
    `http://localhost:3000/api/vechicles/${vechicleId}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicle data: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}

export default async function VechicleID({ params }: any) {
  const { vechicle } = await getVechiclebyId(params.id);

  console.log(vechicle);
  return (
    <div className="  bg-[#D3D3D3]">
      <NavBar />
      <div className="flex flex-col justify-center items-center ] ">
        <h1 className="text-black m-5 text-4xl font-bold">
          {vechicle.make} {vechicle.model} {vechicle.year}
        </h1>
        <Image
          src={vechicle.image}
          alt={vechicle.make}
          width={800}
          height={800}
          className="animate-float z-50"
        />
      </div>
      <div className="flex flex-row justify-center text-gray-700 ">
        <span className="icon-[ph--line-vertical-thin] text-black"></span>
        <ul className="flex flex-row justify-around gap-5 text-xl">
          <li className="">MPG: {vechicle.city_mpg}</li>

          <li>Drive: {vechicle.drive} </li>
          <li>Transmission: {vechicle.transmission}</li>
        </ul>
      </div>
      <div></div>
    </div>
  );
}
