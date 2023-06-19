import { Injectable } from '@nestjs/common';
import { CreatePoiDto } from './dto/create-poi.dto';
import { UpdatePoiDto } from './dto/update-poi.dto';
import { FileUtils } from 'src/config/utils/file.utils';
@Injectable()
export class PoiService {
  count = 0;
  async selfFile(dir: string, head1: string, head2: any) {
    const fileUtils = new FileUtils();
    const files = await fileUtils.getFiles(dir);

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (file !== '.DS_Store') {
        const newDir = `${dir}/${file}`;
        const isFile = await fileUtils.isFile(newDir);
        if (isFile === false) {
          if (newDir.startsWith(head1) || newDir.startsWith(head2)) {
            this.selfFile(newDir, head1, head2);
          }
        } else {
          if (newDir.endsWith('.json')) {
          } else if (newDir.endsWith('.csv')) {
          }
        }
      }
    }
  }
  async mappingOrigin() {
    const dir = '../data/res20230619.json';
    const file = new FileUtils();
    const data = await file.read(dir);
    const jsonData = JSON.parse(data);
    console.log(jsonData.length);

    for (let index = 0; index < 100; index++) {
      const element = jsonData[index];
      console.log(element);
    }
  }

  async mappingLabel() {
    const dir = '../data';
    this.selfFile(dir, 'TL', 'VL');
  }
  create(createPoiDto: CreatePoiDto) {
    return 'This action adds a new poi';
  }

  findAll() {
    return `This action returns all poi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} poi`;
  }

  update(id: number, updatePoiDto: UpdatePoiDto) {
    return `This action updates a #${id} poi`;
  }

  remove(id: number) {
    return `This action removes a #${id} poi`;
  }
}
