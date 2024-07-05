import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyIdToken } from '../../firebase/firebaseAdmin';
import Image from 'next/image';
import NavBar from '../../components/navbar';
async function getVechiclebyId(vechicleId: any) {
  const response = await fetch(
    `http://localhost:3000/api/vechicles/${vechicleId}`,
    {
      method: 'GET',
    }
  );

  return response.json();
}

export default async function VechicleID({ params }: any) {
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
    console.log('car details', vechicle);

    return (
      <div className="  bg-white">
        <NavBar />
        <div className="flex justify-center items-center h-screen ">
          <Image
            src={vechicle.image}
            alt="steering wheel"
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
