import { extname } from 'path';
import * as fs from 'node:fs';

export abstract class BaseConfig {
  static setFilePath(req: any, file: any, callback: any) {
    if (file) {
      if (file.originalname.match(/\.(docx|txt|pdf|csv)$/)) {
        if (!fs.existsSync('./temp/docs')) {
          fs.mkdirSync('./temp/docs', { recursive: true });
        }
        return callback(null, './temp/docs');
      }
      if (file.originalname.match(/\.(jpg|jpeg|png|gif|jfif|webp)$/)) {
        if (!fs.existsSync('./temp/images')) {
          fs.mkdirSync('./temp/images', { recursive: true });
        }
        return callback(null, './temp/images');
      }
      if (file.originalname.match(/\.(avi|mp4|mkv|mov|flv)$/)) {
        if (!fs.existsSync('./temp/videos')) {
          fs.mkdirSync('./temp/videos', { recursive: true });
        }
        return callback(null, './temp/videos');
      }
      if (file.originalname.match(/\.(mp3|wav|bwf|ogg|flac)$/)) {
        if (!fs.existsSync('./temp/audios')) {
          fs.mkdirSync('./temp/audios', { recursive: true });
        }
        return callback(null, './temp/audios');
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
      if (filename.match(/\.(docx|txt|pdf|csv)$/)) return './temp/docs';
      if (filename.match(/\.(jpg|jpeg|png|gif|jfif|webp)$/)) return './temp/images';
      if (filename.match(/\.(avi|mp4|mkv|mov|flv)$/)) return './temp/videos';
      if (filename.match(/\.(mp3|wav|bwf|ogg|flac)$/)) return './temp/audios';
      if (filename.match(/\.(zip)$/)) return './temp';
    }
  }

  static getFileUrl(filename: string) {
    if (filename) {
      return `${process.env.APP_HOST}/v1/files/${filename}`;
    }
    return null;
  }

  // Slugity a string
  static slugify(str: string) {
    str = str.replace(/^\s+|\s+$/g, '');

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from =
      'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;';
    var to =
      'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------';
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Remove invalid chars
    str = str
      .replace(/[^a-z0-9 -]/g, '')
      // Collapse whitespace and replace by -
      .replace(/\s+/g, '-')
      // Collapse dashes
      .replace(/-+/g, '-');

    return str;
  }

  static toTitle(str: string) {
    const arr = str.split('');
    arr[0] = arr[0].toUpperCase();
    return arr.join('');
  }
}
