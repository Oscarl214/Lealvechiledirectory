import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyIdToken } from '../../firebase/firebaseAdmin';

async function getVechiclebyId(vechicleId:any) {
  const response = await fetch(`http://localhost:3000/api/vechicles/${vechicleId}`, {
    method: 'GET',
  });

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
      <div>
        {/* Render the car details here */}
        UserCar: {vechicle.make}
      </div>
    );
  } catch (error) {
    console.error('Error verifying token:', error);
    return redirect('/');
  }
}
