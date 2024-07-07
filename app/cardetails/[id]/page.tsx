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
      <div className="  bg-white">
        <NavBar />
        <div className="flex justify-center items-center h-screen ">
          <Image
            src={vechicle.image}
            alt={vechicle.make}
            width={800}
            height={800}
            className="animate-float z-50"
          />
          {/* UserCar: {vechicle.make} */}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error verifying token:', error);
    return redirect('/');
  }
}
