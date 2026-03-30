import imageCompression from 'browser-image-compression';

// сжатие изображения
export async function processImageBeforeUpload(file) {
    // Сжимать только если размер изображения больше 1 мб

    if (file.size <= 1024 * 1024) {
        console.log("Файл и так легкий, пропускаем сжатие");
        return file;
    }

    const options = {
        maxSizeMB: 1,           // Целевой размер — 1мб
        maxWidthOrHeight: 1920,  // Ограничим разрешение до FullHD
        useWebWorker: true,      // Чтобы интерфейс не фризил во время сжатия
    };

    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.error("Ошибка при сжатии:", error);
        return file; // В случае ошибки возвращаем оригинал
    }

}

