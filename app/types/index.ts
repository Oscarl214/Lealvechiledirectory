import { MouseEventHandler } from 'react';

export interface SearchManufacturerProps {
  manufacturer: string;
  setManufacturer: (manufacturer: string) => void;
}




export interface AddVehicleResponse {
  data: {
    message: string;
  };
}
