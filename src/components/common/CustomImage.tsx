import React, { useState } from 'react';
import clsx from 'clsx';

interface CustomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  lazy?: boolean;
  onError?: () => void;
}

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder-image.png',
  lazy = true,
  className,
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      onError?.();
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      onError={handleError}
      className={clsx(className)}
      {...props}
    />
  );
};

export default React.memo(CustomImage);
