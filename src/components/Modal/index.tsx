import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewImage: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void; // Atualiza a assinatura da função
  uploadProgress: number;
  errorMessage: string | null;
  selectedOverlay: string; // Adiciona a prop para o overlay selecionado
  setSelectedOverlay: (overlay: string) => void; // Função para atualizar o overlay
  selectedEffect: string; // Adiciona a prop para o efeito selecionado
  setSelectedEffect: (effect: string) => void; // Função para atualizar o efeito
}

const overlays = [
  { name: 'Nenhum', url: '' },
  { name: 'Emoji Corações', url: 'https://firebasestorage.googleapis.com/v0/b/livros-15d40.appspot.com/o/filtros%2Fpngtree-lovers-emoticons-background-png-image_2859444-removebg-preview.png?alt=media&token=4282d319-cbe2-4639-85e9-0b24dfd3b9f1' },
  { name: 'Emoji Feliz', url: 'https://firebasestorage.googleapis.com/v0/b/livros-15d40.appspot.com/o/filtros%2Fworld-smile-day-emojis-removebg-preview.png?alt=media&token=00f63d4f-dfec-4c35-aaee-c155151ecc5f' },
  { name: 'Beleza', url: 'https://firebasestorage.googleapis.com/v0/b/livros-15d40.appspot.com/o/filtros%2Fpng-transparent-emoji-doing-thumbs-up-illustration-emoji-emoticon-smiley-like-button-thumb-signal-double-happiness-computer-icons-text-messaging-smile-thumbnail-removebg-preview.png?alt=media&token=0ae406c7-5a7b-472d-ad8c-4a4900d189a5' }
];

const effects = [
  { name: 'Nenhum', className: '' },
  { name: 'Grayscale', className: 'grayscale' },
  { name: 'Blur', className: 'blur-sm' },
  { name: 'Brilho', className: 'brightness-125' }
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
        <h2 className="text-xl font-semibold mb-4 text-white text-center">Enviar Imagem</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          &times;
        </button>
        
        <div className="flex flex-col items-center mb-4">
          {/* Container para imagem com overlay e efeitos */}
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
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${selectedEffect === effect.className ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}`}
              >
                {effect.name}
              </button>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-white mb-2">Selecione Overlay</h3>
          <div className="flex justify-center gap-2 mb-4">
            {overlays.map((overlay) => (
              <button
                key={overlay.name}
                onClick={() => setSelectedOverlay(overlay.url)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${selectedOverlay === overlay.url ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}`}
              >
                {overlay.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 w-full hover:bg-blue-700 transition duration-300"
          >
            Enviar
          </button>
        </div>
        
        {uploadProgress > 0 && (
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-blue-400">
                  Progresso de Envio
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-400">
                  {uploadProgress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div style={{ width: `${uploadProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="text-red-500 text-sm text-center mt-2">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
