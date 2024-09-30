// uploadImage.ts
import { storage } from '@/lib/firebase'; // Ajuste o caminho conforme necessário
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const uploadImageToFirebase = async (file: File, setUploadProgress: (progress: number) => void): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `/images/${file.name}`); // Ajuste o caminho
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};
