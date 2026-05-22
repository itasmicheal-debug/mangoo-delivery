import { useEffect, useState } from 'react';
import { IMAGE_FALLBACK } from '../landing/content';

/**
 * Remote img with fallback when URL 404s, network fails, or Unsplash removes a photo.
 */
export function SafeImage({ src, fallback = IMAGE_FALLBACK, alt = '', onError, ...props }) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <img
      {...props}
      alt={alt}
      src={currentSrc}
      onError={(e) => {
        if (currentSrc !== fallback) {
          setCurrentSrc(fallback);
        }
        onError?.(e);
      }}
    />
  );
}
