// src/mokky/storageService.ts
export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export const mokkyStorage = {
  async uploadFile(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://709da460ccc6f370.mokky.dev/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Mokky возвращает объект с полем id или url
      // Проверим структуру ответа
      console.log('Mokky response:', result);
      
      // Формируем URL файла (Mokky обычно возвращает полный URL)
      const fileUrl = result.url || result.id || `https://709da460ccc6f370.mokky.dev/uploads/${result.id}`;

      return {
        success: true,
        url: fileUrl
      };

    } catch (error: any) {
      console.error('Mokky upload error:', error);
      return {
        success: false,
        error: error.message || 'Ошибка загрузки файла'
      };
    }
  },

  // Опционально: удаление файла (если Mokky поддерживает)
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      const response = await fetch(`https://709da460ccc6f370.mokky.dev/uploads/${fileId}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
};