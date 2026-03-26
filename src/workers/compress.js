import imageCompression from 'browser-image-compression';

// сжатие изображения
export async function processImageBeforeUpload(file) {
    // Сжимать только если размер изображения больше 1 мб

    if (file.size <= 1024 * 1024) {
        console.log("Файл и так легкий, пропускаем сжатие");
        return file;
    }

    const options = {
        maxSizeMB: 1,           // Целевой размер — 1 МБ
        maxWidthOrHeight: 1920,  // Ограничим разрешение до Full HD (тоже экономит вес)
        useWebWorker: true,      // Чтобы интерфейс не фризил во время сжатия
    };

    try {
        console.log(`Начинаем сжатие... Исходный вес: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
        const compressedFile = await imageCompression(file, options);
        console.log(`Готово! Новый вес: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
        return compressedFile;
    } catch (error) {
        console.error("Ошибка при сжатии:", error);
        return file; // В случае ошибки возвращаем оригинал
    }

}

