import { Injectable } from '@nestjs/common';

/**
 * 파일 처리 유틸
 */
export class FileUtils {
  fs: any;

  constructor() {
    this.fs = require('fs');
  }

  /**
   * 파일에 쓰기
   * @param path
   * @param fileName
   * @param data
   */
  async write(path: string, fileName: string, data: string) {
    if (!this.fs.existsSync(path)) {
      this.fs.mkdirSync(path, { recursive: true });
    }

    await this.fs.writeFileSync(`${path}/${fileName}`, data, {
      encoding: 'utf8',
      flag: 'a+',
      mode: 0o666,
    });
  }

  /**
   * 파일 읽기
   * @param path
   * @param fileName
   * @returns
   */
  async read(path: string) {
    const data = await this.fs.readFileSync(path, 'utf-8');
    return data;
  }

  /**
   * 해당 폴더 파일리스트 가져오기
   * @param path
   * @returns
   */
  async getFiles(path: string) {
    if (!this.fs.existsSync(path)) {
      return;
    }
    const files = this.fs.readdirSync(path);
    return files;
  }

  async isFile(path: string) {
    const data = this.fs.lstatSync(path);
    if (data.isFile()) {
      return true;
    } else {
      return false;
    }
  }
}
