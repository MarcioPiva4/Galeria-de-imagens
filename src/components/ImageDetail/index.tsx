// components/ImageDetail.tsx
import React from 'react';

interface ImageDetailProps {
  image: { url: string; description: string };
  onClose: () => void;
}

const ImageDetail: React.FC<ImageDetailProps> = ({ image, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
      <div className="bg-gray-800 rounded-lg p-4 w-11/12 max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-5xl hover:text-red-500 transition-colors duration-300"
          aria-label="Fechar"
        >
          &times;
        </button>
        <img src={image.url} alt="Imagem Detalhe" className="rounded-lg w-full h-64 object-cover mb-4" />
        <p className="text-white text-lg">{image.description || "Descrição não disponível."}</p>
      </div>
    </div>
  );
};

export default ImageDetail;
