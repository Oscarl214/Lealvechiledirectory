import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyIdToken } from '../../firebase/firebaseAdmin';
import Image from 'next/image';
import NavBar from '../../components/navbar';

interface Vechicle {
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

async function getVechiclebyId(vechicleId: string): Promise<Vechicle> {
  const response = await fetch(
    `http://localhost:3000/api/vechicles/${vechicleId}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicle data: ${response.statusText}`);
  }

  return response.json();
}

export default async function VechicleID({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return redirect('/');
  }

  try {
    const decodedToken = await verifyIdToken(token);

    if (!decodedToken) {
      return redirect('/');
    }

    const { vechicle } = await getVechiclebyId(params.id);

    return (
      <div className="  bg-[#D3D3D3]">
        <NavBar />
        <div className="flex flex-col justify-center items-center ] ">
          <h1 className='text-black m-5 text-4xl font-bold'>{vechicle.make} {vechicle.model} {vechicle.year}</h1>
          <Image
            src={vechicle.image}
            alt={vechicle.make}
            width={800}
            height={800}
            className="animate-float z-50"
          />
        </div>
        <div className='flex flex-row justify-center text-gray-700 '>
          <span className="icon-[ph--line-vertical-thin] text-black"></span>
           <ul className='flex flex-row justify-around gap-5 text-xl'>
             <li className=''>MPG:  {vechicle.city_mpg}</li>
             
             <li>Drive: {vechicle.drive} </li>
             <li>Transmission: {vechicle.transmission}</li>
           </ul>
          </div>
        <div>
       
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error verifying token:', error);
    return redirect('/');
  }
}
