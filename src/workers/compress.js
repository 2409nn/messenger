const compressImage = (file, quality = 0.7) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Можно попутно уменьшить размер в пикселях
            canvas.width = img.width / 2;
            canvas.height = img.height / 2;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Магия происходит здесь: второй аргумент — качество от 0 до 1
            canvas.toBlob((blob) => {
                console.log('Сжатый файл:', blob);
            }, 'image/jpeg', quality);
        };
    };
};