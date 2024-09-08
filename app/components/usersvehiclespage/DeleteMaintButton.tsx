import React from 'react';

const DeleteMaint = ({ onClick }: any) => {
  return (
    <a
      onClick={onClick}
      className="relative flex justify-end items-end cursor-pointer group"
    >
      <span className="icon-[wpf--delete] text-red-500 ml-4 " />

      <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 whitespace-nowrap text-sm text-red-500 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
        Delete Maintenance
      </span>
    </a>
  );
};

export default DeleteMaint;
