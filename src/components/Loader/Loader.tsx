import React from 'react';

const Loader = ({ progress }: { progress: number }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500 mb-4"></div>
      <div className="text-xl font-semibold">{progress}%</div>
      <p className="mt-2 text-gray-500">Processing, please wait...</p>
    </div>
  );
};

export default Loader;
