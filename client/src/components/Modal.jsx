import React from 'react';

// This component takes three props:
// isOpen: a boolean to control visibility
// onClose: a function to call when the modal should be closed
// children: the content to display inside the modal
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null; // Don't render anything if the modal is closed
  }

  return (
    // The semi-transparent backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={onClose} // Close the modal if the backdrop is clicked
    >
      {/* The modal content itself */}
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
