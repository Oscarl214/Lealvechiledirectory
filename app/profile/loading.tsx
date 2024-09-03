'use client';
import { Spinner } from '@nextui-org/react';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner className="text-blue-500 text-5xl" label="Loading..." />
    </div>
  );
}
