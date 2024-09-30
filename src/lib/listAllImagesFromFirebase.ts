// lib/listAllImagesFromFirebase.ts
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { app } from "./firebase"; // Certifique-se de que está importando a inicialização do Firebase

export const listAllImagesFromFirebase = async () => {
  const storage = getStorage(app);
  const listRef = ref(storage, '/images'); // Atualize para o caminho correto das suas imagens

  const imageUrls: { url: string; description: string }[] = [];

  try {
    const res = await listAll(listRef);
    const promises = res.items.map(async (item) => {
      const url = await getDownloadURL(item);
      // Aqui você pode adicionar uma lógica para obter a descrição, se necessário
      return { url, description: '' }; // Atualize conforme necessário
    });

    const urls = await Promise.all(promises);
    return urls;
  } catch (error) {
    console.error("Erro ao listar imagens:", error);
    throw error; // Propagar o erro
  }
};
