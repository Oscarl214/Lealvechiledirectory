import React from 'react';

const DeleteVehicleButton = ({ onClick }: any) => {
  return (
    <a
      onClick={onClick}
      className="relative flex justify-end items-end cursor-pointer group"
    >
      <span className="icon-[ph--x-circle-thin] text-red-500 text-xl" />

      {/* Tooltip text */}
      <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 whitespace-nowrap text-sm text-red-500 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
        Delete Vehicle
      </span>
    </a>
  );
};

export default DeleteVehicleButton;
