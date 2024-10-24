import { storage } from '@/lib/firebase'; // Ajuste o caminho conforme necessário
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const applyOverlayAndEffect = (image: HTMLImageElement, overlayUrl: string, effectClassName: string): Promise<HTMLCanvasElement> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Failed to get canvas context");

    // Definindo dimensões do canvas com margem para a borda
    const borderWidth = 16; // Ajuste a espessura da borda para parecer com "border-4"
    canvas.width = image.width + borderWidth * 2;
    canvas.height = image.height + borderWidth * 2;

    // Aplicar cor de fundo (borda amarela) ao canvas
    if (effectClassName === 'border-4 border-yellow-500') {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Preencher o fundo com amarelo
    }

    // Aplicar efeito (se houver) antes de desenhar a imagem
    ctx.filter = 'none';
    if (effectClassName === 'grayscale') {
      ctx.filter = 'grayscale(1)';
    } else if (effectClassName === 'blur-sm') {
      ctx.filter = 'blur(5px)';
    } else if (effectClassName === 'brightness-125') {
      ctx.filter = 'brightness(1.25)';
    }

    // Desenhar a imagem original com bordas ao redor
    ctx.drawImage(image, borderWidth, borderWidth);

    // Desenhar o overlay, se houver
    if (overlayUrl) {
      const overlayImage = new Image();
      overlayImage.src = overlayUrl;
      overlayImage.crossOrigin = 'Anonymous'; // Permitir cross-origin

      overlayImage.onload = () => {
        ctx.drawImage(overlayImage, borderWidth, borderWidth, image.width, image.height);
        resolve(canvas); // Resolve o canvas após desenhar o overlay
      };
    } else {
      resolve(canvas); // Resolve o canvas se não houver overlay
    }
  });
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
      img.crossOrigin = 'Anonymous'; // Permitir cross-origin

      img.onload = async () => {
        const canvas = await applyOverlayAndEffect(img, overlay, effect); // Espera o canvas ser retornado
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
