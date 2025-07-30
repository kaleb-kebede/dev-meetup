import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <div
        className="w-12 h-12 rounded-full animate-spin
                    border-4 border-solid border-cyan-400 border-t-transparent"
      ></div>
    </div>
  );
};

export default Spinner;
