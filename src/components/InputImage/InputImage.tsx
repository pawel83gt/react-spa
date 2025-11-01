// components/InputImage/InputImage.tsx
import { useState, useRef } from 'react';
import { mokkyStorage } from '../../mokky/storageService';
import type { UploadResponse } from '../../mokky/storageService';

interface ImageUploadProps {
  id: string;
  label: string;
  onImageUpload: (imageUrl: string) => void;
}

const InputImage = ({ id, label, onImageUpload }: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Проверяем размер файла (до 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 5MB');
      return;
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Временный предпросмотр
    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);
    setUploading(true);

    try {
      // Загружаем в Mokky
      const result: UploadResponse = await mokkyStorage.uploadFile(file);
      
      if (result.success && result.url) {
        // Передаем URL родительскому компоненту
        onImageUpload(result.url);
        
        // Очищаем временный URL и устанавливаем постоянный
        URL.revokeObjectURL(tempUrl);
        setPreviewUrl(result.url);
        
        console.log('✅ Файл успешно загружен:', result.url);
      } else {
        throw new Error(result.error || 'Неизвестная ошибка загрузки');
      }
      
    } catch (error: any) {
      console.error('Mokky upload error:', error);
      alert(`Ошибка загрузки файла: ${error.message}`);
      setPreviewUrl('');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={uploading}
      />
      
      <div 
        onClick={handleClick}
        className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
          uploading 
            ? 'border-gray-300 bg-gray-100' 
            : 'border-gray-300 hover:border-blue-500'
        }`}
      >
        {uploading ? (
          <div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Загрузка в Mokky...</p>
          </div>
        ) : previewUrl ? (
          <div>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full h-32 object-cover rounded-md mx-auto"
            />
            <p className="text-sm text-gray-600 mt-2">Нажмите для выбора другой картинки</p>
          </div>
        ) : (
          <div>
            <div className="text-gray-400 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">Нажмите для загрузки картинки</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG до 5MB</p>
            <p className="text-xs text-green-600 mt-1">⚡ Хранится в Mokky.dev</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputImage;