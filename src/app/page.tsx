'use client';

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import ImageDetail from "@/components/ImageDetail";
import { listenToImageUpdates } from "@/lib/listAllImagesFromFirebase"; // Altere para a nova função
import { uploadImageToFirebase } from "@/lib/uploadImage";
import Image from "next/image";

export default function Home() {
  const [modal, setModal] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{ url: string; description: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ url: string; description: string } | null>(null);
  
  const [selectedOverlay, setSelectedOverlay] = useState<string>('');
  const [selectedEffect, setSelectedEffect] = useState<string>('');

  useEffect(() => {
    const unsubscribe = listenToImageUpdates(setImageUrls); // Chama a função de escuta

    return () => unsubscribe(); // Cancela a escuta ao desmontar o componente
  }, []); // Apenas uma vez na montagem

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile && previewImage) {
      try {
        setErrorMessage(null);
  
        // Envia a imagem para o Firebase
        const url = await uploadImageToFirebase(selectedFile, selectedOverlay, selectedEffect, setUploadProgress);
  
        // Aqui, você deve garantir que a URL e descrição sejam salvas no Firestore após o upload
        // Supondo que você tenha uma função para adicionar a imagem ao Firestore
        
        resetModalState(); // Reseta os estados do modal
      } catch (error) {
        setErrorMessage("Erro ao enviar a imagem. Por favor, tente novamente.");
      }
    }
  };
  
  const resetModalState = () => {
    setModal(false);
    setPreviewImage(null);
    setSelectedFile(null);
    setUploadProgress(0);
    setSelectedOverlay(''); // Reseta overlay
    setSelectedEffect(''); // Reseta efeito
  };

  return (
    <div className="h-full w-full bg-indigo-950 p-6">
      <h2 className="text-3xl text-yellow-500 text-center mb-6">Galeria de Exposição de Imagens</h2>
      <div className="flex flex-wrap justify-center items-start gap-4">
        {imageUrls.length > 0 ? (
          imageUrls.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.url}
                alt={`Exposição ${index}`}
                width={300}
                height={300}
                className="object-cover w-64 h-40 rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-yellow-500 text-sm">Ver Detalhes</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-yellow-500 text-center w-full">
          {imageUrls.length === 0 ? "Carregando imagens..." : "Nenhuma imagem disponível"}
        </div>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setModal(true)}
          className="bg-yellow-500 text-black rounded-full px-6 py-2 transition-all duration-300 hover:bg-yellow-600 text-lg"
        >
          Enviar Imagem
        </button>
      </div>

      {modal && (
        <Modal
          isOpen={modal}
          onClose={() => setModal(false)}
          previewImage={previewImage}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
          uploadProgress={uploadProgress}
          errorMessage={errorMessage}
          selectedOverlay={selectedOverlay}
          setSelectedOverlay={setSelectedOverlay}
          selectedEffect={selectedEffect}
          setSelectedEffect={setSelectedEffect}
        />
      )}

      {selectedImage && (
        <ImageDetail
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
