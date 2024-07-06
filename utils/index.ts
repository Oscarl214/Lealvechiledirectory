// import { CarProps } from '@/app/types';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../app/firebase/config';
export async function fetchCars() {
  const headers = {
    'x-rapidapi-key': '9945cc4495msh5c3f59c2d03519cp1ac84ajsn025f89e35f6f',
    'x-rapidapi-host': 'cars-by-api-ninjas.p.rapidapi.com',
  };
  const response = await fetch(
    'https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?model=bmw',
    {
      headers: headers,
      cache: 'no-cache',
    }
  );

  const result = await response.json();

  console.log(result);
  return result;
}

// async function fetchVehicles) {
//   const response = await fetch(`http://localhost:3000/api/products/${postId}`, {
//     method: 'GET',
//   });

//   return response.json();
// }

async function fetchVehicles() {
  const response = await fetch(`http://localhost:3000/api`, {
    method: 'GET',
  });

  return response.json();
}

// export const generateCarImageUrl = (car: CarProps, angle?: string) => {
//   const url = new URL(
//     'https://api.fuelapi.com/v1/xml/vehicles/?api_key=daefd14b-9f2b-4968-9e4d-9d4bb4af01d1'
//   );

//   const { make, model, year } = car;

//   // url.searchParams.append('api_key', process.env.FUEL_DEMO_API_KEY || '');

//   url.searchParams.append('make', `${make}`);
//   url.searchParams.append('modelFamily', model.split(' ')[0]);
//   url.searchParams.append('year', `${year}`);

//   console.log(`url, ${url}`);

//   return `${url}`;
// };

export const addVehicleToProfile = async (userId: any, vehicle: any) => {
  try {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      vehicles: arrayUnion(vehicle),
    });

    console.log('Vehicle added successfully!');
  } catch (error) {
    console.log('Vechicle added unsuccesfully!');
  }
};
