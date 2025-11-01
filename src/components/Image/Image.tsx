// components/Image/Image.tsx
import { useState } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

const Image = ({ 
  src, 
  alt, 
  fill = false, 
  className = '', 
  sizes,
  priority = false 
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const imageClass = fill 
    ? `absolute inset-0 w-full h-full object-cover ${className}`
    : `block w-full h-auto ${className}`;

  return (
    <div className={fill ? 'relative w-full h-full' : ''}>
      <img
        src={src}
        alt={alt}
        className={`${imageClass} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-400 text-sm">Загрузка...</span>
        </div>
      )}
    </div>
  );
};

export default Image;