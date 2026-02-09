import { extname } from 'path';
import * as fs from 'node:fs';
import * as sharp from 'sharp';

export abstract class BaseConfig {
  static FILES_DIR = '/app/data';

  static setFilePath(req: any, file: any, callback: any) {
    if (file) {
      if (file.originalname.match(/\.(docx|txt|pdf|csv)$/)) {
        if (!fs.existsSync(`${this.FILES_DIR}/docs`)) {
          fs.mkdirSync(`${this.FILES_DIR}/docs`, { recursive: true });
        }
        return callback(null, `${this.FILES_DIR}/docs`);
      }
      if (file.originalname.match(/\.(jpg|jpeg|png|gif|jfif|webp)$/)) {
        if (!fs.existsSync(`${this.FILES_DIR}/images`)) {
          fs.mkdirSync(`${this.FILES_DIR}/images`, { recursive: true });
        }
        return callback(null, `${this.FILES_DIR}/images`);
      }
      if (file.originalname.match(/\.(avi|mp4|mkv|mov|flv)$/)) {
        if (!fs.existsSync(`${this.FILES_DIR}/videos`)) {
          fs.mkdirSync(`${this.FILES_DIR}/videos`, { recursive: true });
        }
        return callback(null, `${this.FILES_DIR}/videos`);
      }
      if (file.originalname.match(/\.(mp3|wav|bwf|ogg|flac)$/)) {
        if (!fs.existsSync(`${this.FILES_DIR}/audios`)) {
          fs.mkdirSync(`${this.FILES_DIR}/audios`, { recursive: true });
        }
        return callback(null, `${this.FILES_DIR}/audios`);
      } else {
        return callback(new Error('File type not supported'), false);
      }
      
    }
  }

  static editFileName(req: any, file: any, callback: any) {
    if (file) {
      const slugify = (str: string) => {
        str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
        str = str.toLowerCase(); // convert string to lowercase
        str = str
          .normalize('NFD') // Décompose les accents
          .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
          .replace(/\s+/g, '-') // replace spaces with hyphens
          .replace(/-+/g, '-'); // remove consecutive hyphens
        return str;
      };
      const oname: string = file.originalname.split('.')[0];
      const name = oname.length < 11 ? oname : oname.slice(0, 10);
      const fileExtName = extname(file.originalname);
      const randomName = Array(10)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      const customName = `${name}-${randomName}`;
      const finalName = `${slugify(customName)}${fileExtName}`;
      callback(null, `${finalName}`);
    }
  }

  static fileFilter(req: any, file: any, callback: any) {
    if (
      !file.originalname.match(
        /\.(jpg|jpeg|png|gif|webp|jfif|docx|txt|pdf|csv|mp3|wav|bwf|ogg|flac|avi|mp4|mkv|mov|flv)$/,
      )
    ) {
      return callback(
        new Error('Only authorized extension are allowed!'),
        false,
      );
    }
    callback(null, true);
  }

  static getFilePath(filename: string) {
    if (filename) {
      if (filename.match(/\.(docx|txt|pdf|csv)$/)) return `${this.FILES_DIR}/docs`;
      if (filename.match(/\.(jpg|jpeg|png|gif|jfif|webp)$/)) return `${this.FILES_DIR}/images`;
      if (filename.match(/\.(avi|mp4|mkv|mov|flv)$/)) return `${this.FILES_DIR}/videos`;
      if (filename.match(/\.(mp3|wav|bwf|ogg|flac)$/)) return `${this.FILES_DIR}/audios`;
      if (filename.match(/\.(zip)$/)) return `${this.FILES_DIR}`;
    }
  }

  static getFileUrl(filename: string) {
    if (filename) {
      return `${process.env.APP_HOST}/files/${filename}`;
    }
    return null;
  }

  static async processImage(fileName: string) {
    if (!fileName) return;
    const filePath = `${BaseConfig.FILES_DIR}/images/${fileName}`
    const ext = extname(filePath);
    const tempPath = filePath.replace(ext, `-temp${ext}`);

    await sharp(filePath)
      .resize({
      width: 900,
      withoutEnlargement: true
      }) // Redimensionne à 900px de large (conserve le ratio)
      .jpeg({ quality: 50 }) // Compresse à 50%
      .toFile(tempPath);

    // Remplace l'original par la version optimisée
    fs.renameSync(tempPath, filePath);
  }

  static async deleteFile(fileName: string) {
    if (!fileName) return;
    const filePath = BaseConfig.getFilePath(fileName)+`/${fileName}`

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Ancienne image supprimée : ${fileName}`);
      } catch (err) {
        console.error(`Erreur lors de la suppression de l'image : ${err.message}`);
      }
    }
  };


  static toTitle(str: string) {
    const arr = str.split('');
    arr[0] = arr[0].toUpperCase();
    return arr.join('');
  }
}
