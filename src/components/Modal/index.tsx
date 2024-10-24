import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewImage: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
  uploadProgress: number;
  errorMessage: string | null;
  selectedOverlay: string;
  setSelectedOverlay: (overlay: string) => void;
  selectedEffect: string;
  setSelectedEffect: (effect: string) => void;
}

const effects = [
  { name: 'Nenhum', className: '' },
  { name: 'Grayscale', className: 'grayscale' },
  { name: 'Blur', className: 'blur-sm' },
  { name: 'Brilho', className: 'brightness-125' },
  { name: 'Faixa Amarela', className: 'border-4 border-yellow-500' } // Efeito de faixa amarela
];

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  previewImage,
  handleFileChange,
  handleUpload,
  uploadProgress,
  errorMessage,
  selectedOverlay,
  setSelectedOverlay,
  selectedEffect,
  setSelectedEffect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-yellow-500 text-center">Enviar Imagem</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-yellow-500"
        >
          &times;
        </button>
        
        <div className="flex flex-col items-center mb-4">
          {previewImage && (
            <div className={`relative w-full h-40 mb-4 ${selectedEffect}`}>
              <img
                src={previewImage}
                alt="Preview"
                className={`w-full h-full object-cover rounded-md ${selectedEffect}`}
              />
              {selectedOverlay && (
                <img
                  src={selectedOverlay}
                  alt="Overlay"
                  className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none opacity-75"
                />
              )}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-600 rounded-md p-2 mb-2 w-full text-white bg-gray-700"
          />

          <h3 className="text-sm font-semibold text-white mb-2">Aplique Filtros</h3>
          <div className="flex justify-center gap-2 mb-4">
            {effects.map((effect) => (
              <button
                key={effect.name}
                onClick={() => setSelectedEffect(effect.className)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${selectedEffect === effect.className ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
              >
                {effect.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleUpload}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg mt-4 w-full hover:bg-yellow-600 transition duration-300"
          >
            Enviar
          </button>
        </div>
        
        {uploadProgress > 0 && (
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-yellow-400">
                  Progresso de Envio
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-yellow-400">
                  {uploadProgress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
              <div style={{ width: `${uploadProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
            </div>
          </div>
        )}
        
        {errorMessage && (
          <div className="mt-4 text-red-500 text-sm">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
