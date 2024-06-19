// import { NextApiRequest, NextApiResponse } from 'next';

// const vehicles= [
//     {
//         id: 1,
//         make: "Chevrolet",
//         model: "Silverado",
//         year: 2021,
//         fuel_type: "gas",
//         drive: "rwd",
//         transmission: "a",
//         cylinders: 8,
//         displacement: 5.3,
//         city_mpg: 17,
//         highway_mpg: 23,
//         combination_mpg: 19,
//         class: "pickup"
//     },
//     {
//         id: 2,
//         make: "Toyota",
//         model: "4Runner",
//         year: 2019,
//         fuel_type: "gas",
//         drive: "4wd",
//         transmission: "a",
//         cylinders: 6,
//         displacement: 4.0,
//         city_mpg: 17,
//         highway_mpg: 20,
//         combination_mpg: 18,
//         class: "SUV"
//     },
// ];

// export default function get(req: NextApiRequest, res: NextApiResponse) {
//     // Respond with JSON data
//     res.status(200).json(vehicles);
// }


export async function GET(){
    let res=[
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
            class: "pickup"
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
            class: "SUV"
        },
    ];

    return Response.json(res)

}