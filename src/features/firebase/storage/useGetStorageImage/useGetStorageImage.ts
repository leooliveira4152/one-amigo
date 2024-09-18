import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import useImage from "use-image";

import { storage } from "../storage";

// TODO - what if the image fails to load? Using a wrong URL
export function useGetStorageImage(imagePath: string) {
  const [imageObject, setImageObject] = useState<HTMLImageElement>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>();

  useEffect(() => {
    const getImage = async () => {
      const storageRef = ref(storage, imagePath);
      const url = await getDownloadURL(storageRef);

      const img = new Image();
      img.src = url;
      img.onload = () => setImageDimensions({ width: img.width, height: img.height });
      setImageUrl(url);
      setImageObject(img);
    };
    getImage();
  }, [imagePath]);

  const htmlElement = useImage(imageUrl ?? "");

  return {
    imageUrl,
    imageElement: htmlElement[0],
    dimensions: imageDimensions,
    status: htmlElement[1],
    imageObject,
  };
}
