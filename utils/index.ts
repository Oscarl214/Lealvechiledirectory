export async function fetchCars() {
  const headers = {
    'x-rapidapi-key': '9945cc4495msh5c3f59c2d03519cp1ac84ajsn025f89e35f6f',
    'x-rapidapi-host': 'cars-by-api-ninjas.p.rapidapi.com',
  };
  const response = await fetch(
    'https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?model=corolla',
    {
      headers: headers,
      cache: 'no-cache',
    }
  );

  const result = await response.json();

  return result;
}
