// lib/listAllImagesFromFirestore.ts
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "./firebase";

export const listenToImageUpdates = (callback: (images: { url: string; description: string }[]) => void) => {
  const db = getFirestore(app);
  const imagesCollection = collection(db, "images"); // Nome da coleção no Firestore

  const unsubscribe = onSnapshot(imagesCollection, (snapshot) => {
    const images: { url: string; description: string }[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      images.push({ url: data.url, description: data.description });
    });
    callback(images); // Atualiza o estado com a nova lista de imagens
  });

  return unsubscribe; // Função para cancelar a escuta
};
