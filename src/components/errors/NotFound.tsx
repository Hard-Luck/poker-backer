import React from 'react';

interface NotFoundProps {
  page: string | undefined;
}

export default function NotFound({ page }: NotFoundProps) {
  page ??= 'page';
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-gray-600">
        Oops, that <span className="font-semibold">{page}</span> you are looking
        for is not found
      </p>
    </div>
  );
}
