// components/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewImage: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
  uploadProgress: number;
  errorMessage: string | null;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  previewImage,
  handleFileChange,
  handleUpload,
  uploadProgress,
  errorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-white text-center">Enviar Imagem</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          &times;
        </button>
        
        <div className="flex flex-col items-center mb-4">
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mb-4 rounded-md w-full h-32 object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-600 rounded-md p-2 mb-2 w-full text-white bg-gray-700"
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
          )}
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200"
            disabled={!previewImage} // Desabilita o botão se não houver imagem
          >
            {uploadProgress > 0 ? `Enviando... ${uploadProgress.toFixed(2)}%` : 'Enviar Imagem'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
