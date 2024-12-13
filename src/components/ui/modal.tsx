import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  actionText: string;
  onClose: () => void;
  onAction?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  actionText,
  onClose,
  onAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-xl text-gray-900 font-bold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6 text-md">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onAction}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};
