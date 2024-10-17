import { storage } from '@/lib/firebase'; // Ajuste o caminho conforme necessário
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const applyOverlayAndEffect = (image: HTMLImageElement, overlayUrl: string, effectClassName: string): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Failed to get canvas context");

  // Definindo dimensões do canvas
  canvas.width = image.width;
  canvas.height = image.height;

  // Desenhar a imagem original no canvas
  ctx.drawImage(image, 0, 0);

  // Aplicar efeito, se houver
  if (effectClassName === 'grayscale') {
    ctx.filter = 'grayscale(1)';
    ctx.drawImage(canvas, 0, 0);
  } else if (effectClassName === 'blur-sm') {
    ctx.filter = 'blur(5px)';
    ctx.drawImage(canvas, 0, 0);
  } else if (effectClassName === 'brightness-125') {
    ctx.filter = 'brightness(1.25)';
    ctx.drawImage(canvas, 0, 0);
  }

  // Desenhar o overlay, se houver
  if (overlayUrl) {
    const overlayImage = new Image();
    overlayImage.src = overlayUrl;
    overlayImage.onload = () => {
      ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
    };
  }

  return canvas;
};

export const uploadImageToFirebase = async (
  file: File,
  overlay: string,
  effect: string,
  setUploadProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = async () => {
        const canvas = applyOverlayAndEffect(img, overlay, effect);
        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(new Error("Failed to create blob from canvas"));
            return;
          }

          const storageRef = ref(storage, `/images/${file.name}`); // Ajuste o caminho
          const uploadTask = uploadBytesResumable(storageRef, blob);

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
        }, 'image/png');
      };
    };

    reader.readAsDataURL(file);
  });
};
