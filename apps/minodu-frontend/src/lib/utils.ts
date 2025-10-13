
export function delay(ms: number) : Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

export function mimeTypeToFileExtension(mimeType: string) : string {
    const mimeToExtension: Record<string, string> = {
        // Images
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/svg+xml': '.svg',
        'image/bmp': '.bmp',
        'image/tiff': '.tiff',
        'image/x-icon': '.ico',
        'image/heic': '.heic',
        'image/heif': '.heif',
        'image/avif': '.avif',

          // Audio
        'audio/mpeg': '.mp3',
        'audio/wav': '.wav',
        'audio/ogg': '.ogg',
        'audio/mp4': '.m4a',
        'audio/aac': '.aac',
        'audio/flac': '.flac',
        'audio/x-ms-wma': '.wma',
        'audio/webm': '.webm',
    }

    if (!mimeType) 
        return '';
  
    // Normalize and handle charset parameters (e.g., 'text/html; charset=utf-8')
    const normalizedMime = mimeType.toLowerCase().split(';')[0].trim();
    return mimeToExtension[normalizedMime] || '';
}