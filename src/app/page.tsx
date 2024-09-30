// page.tsx
'use client';

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import ImageDetail from "@/components/ImageDetail";
import { listAllImagesFromFirebase } from "@/lib/listAllImagesFromFirebase";
import { uploadImageToFirebase } from "@/lib/uploadImage";

export default function Home() {
  const [modal, setModal] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{ url: string; description: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ url: string; description: string } | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const urls = await listAllImagesFromFirebase();
        setImageUrls(urls);
      } catch (error) {
        console.error("Erro ao buscar imagens:", error);
      }
    };

    fetchImages();
  }, [uploadProgress]);

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
    if (selectedFile) {
      try {
        setErrorMessage(null);
        const url = await uploadImageToFirebase(selectedFile, setUploadProgress);
        setImageUrls([...imageUrls, { url, description: "" }]); // Add new image URL
        setModal(false);
        setPreviewImage(null);
        setSelectedFile(null);
        setUploadProgress(0);
      } catch (error) {
        setErrorMessage("Erro ao enviar a imagem. Por favor, tente novamente.");
      }
    }
  };

  return (
    <div className="h-auto w-full bg-gray-900 p-6">
      <h2 className="text-3xl text-white text-center mb-6">Galeria de Exposição de Imagens</h2>
      <div className="flex flex-wrap justify-center items-start gap-4">
        {imageUrls.length > 0 ? (
          imageUrls.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={`Exposição ${index}`}
                className="object-cover w-64 h-40 rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm">Ver Detalhes</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-white text-center w-full">
            Nenhuma imagem disponível
          </div>
        )}
      </div>

      {/* Botão de envio */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setModal(true)}
          className="bg-blue-600 text-white rounded-full px-6 py-2 transition-all duration-300 hover:bg-blue-700 text-lg"
        >
          Enviar Imagem
        </button>
      </div>

      {/* Modal para upload */}
      {modal && (
        <Modal
          isOpen={modal}
          onClose={() => setModal(false)}
          previewImage={previewImage}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
          uploadProgress={uploadProgress}
          errorMessage={errorMessage}
        />
      )}

      {/* Modal para detalhes da imagem */}
      {selectedImage && (
        <ImageDetail
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
