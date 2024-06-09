import { Spinner } from '@nextui-org/react';

export default function Loading() {
  return (
    <Spinner className="flex justify-center text-4xl" color="primary">
      Loading
    </Spinner>
  );
}
