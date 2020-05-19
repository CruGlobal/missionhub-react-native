import { useEffect, useState } from 'react';
import { Image } from 'react-native';

export const useAspectRatio = (image?: string | null) => {
  const [imageAspectRatio, changeImageAspectRatio] = useState(2);
  useEffect(() => {
    if (!image) {
      return;
    }
    Image.getSize(
      image,
      (width, height) => changeImageAspectRatio(width / height),
      () => {},
    );
  }, [image]);
  return imageAspectRatio;
};
