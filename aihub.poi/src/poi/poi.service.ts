import { Injectable } from '@nestjs/common';
import { FileUtils } from 'src/config/utils/file.utils';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class PoiService {
  constructor(private readonly prisma: PrismaService) {}
  count = 0;
  async selfFile(dir: string) {
    const fileUtils = new FileUtils();
    const files = await fileUtils.getFiles(dir);

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (file !== '.DS_Store') {
        const newDir = `${dir}/${file}`;
        const isFile = await fileUtils.isFile(newDir);
        if (isFile === false) {
          this.prisma.useFile.create({ data: { dir: newDir, name: '' } });
          this.selfFile(newDir);
        } else {
          const txt = await fileUtils.read(newDir);
          const txtJson = JSON.parse(txt);
          await this.insertFile(txtJson);
        }
      }
    }
  }
  async mappingOrigin() {
    const dir = '../data/res20230619.json';
    const file = new FileUtils();
    const data = await file.read(dir);
    const jsonData = JSON.parse(data);
    const total = jsonData.length;

    for (let index = 0; index < jsonData.length; index++) {
      const element = jsonData[index];
      const count = await this.prisma.poi.count({
        where: { poiNum: element['poi_id'] },
      });
      if (count === 0) {
        const keys = Object.keys(element);
        const elseData = {};
        for (let index = 0; index < keys.length; index++) {
          const key = keys[index];
          if (
            element[key] !== 'poi_id' &&
            element[key] !== 'name' &&
            element[key] !== 'addr' &&
            element[key] !== 'type'
          ) {
            elseData[key] = element[key];
          }
        }

        const data = {
          poiNum: element['poi_id'] === undefined ? '' : element['poi_id'],
          name: element['name'] === undefined ? '' : element['name'],
          addr: element['addr'] === undefined ? '' : element['addr'],
          type: element['type'] === undefined ? '' : element['type'],
          elseData: JSON.stringify(elseData),
        };
        console.log(
          `${total} / ${index} - ${data.poiNum} = ${element['addr']}`,
        );
        await this.prisma.poi.create({
          data,
        });
      }
    }
  }

  async mappingLabel() {
    const dir = '../data/label';
    await this.selfFile(dir);
    return 'end';
  }

  async insertFile(json: any) {
    const data = {
      poiNum: json['data']['POI_id'],
      type: json['data']['travelType'],
      name: '',
      addr: '',
      lang: '',
      elseData: '',
    };
    const list = json['annotations'];

    const elseData = {};
    for (let index = 0; index < list.length; index++) {
      const d = list[index];
      if (d['k_column'] === '관광타입') {
        data['name'] = d['t_context'];
        data['lang'] = d['language'];
      } else if (d['k_column'].startsWith('주소')) {
        data['addr'] = d['t_context'];
        data['lang'] = d['language'];
      } else if (
        d['k_column'] === '업소명' ||
        d['k_column'] === '시설명' ||
        d['k_column'] === '관광지명' ||
        d['k_column'] === '음식점명'
      ) {
        data['name'] = d['t_context'];
        data['lang'] = d['language'];
      } else {
        elseData[d['k_column']] = d['t_context'];
      }
    }
    data['elseData'] = JSON.stringify(elseData);

    const count = await this.prisma.poi.count({
      where: { poiNum: data.poiNum, lang: data.lang },
    });
    if (count === 0) {
      await this.prisma.poi.create({ data });
    }
    // console.log(data);
  }
  /**
{
  data: { dataset: '2-083-221', POI_id: '32', travelType: '관광지' },
  annotations: [
    {
      k_column: '관광타입',
      k_context: '관광지',
      k_context_wordnum: 1,
      language: 'en',
      t_column: 'Tourism Type',
      t_context: 'Tourist Attraction',
      t_wordnum: 2,
      lengthtype: 1
    },
    {
      k_column: '관광지명',
      k_context: '사랑의동산교회',
      k_context_wordnum: 1,
      language: 'en',
      t_column: 'Name',
      t_context: 'Garden of Love Church',
      t_wordnum: 4,
      lengthtype: 1
    },
    {
      k_column: '주소(도로명)',
      k_context: '경기 김포시 돌문로95번길 13-28',
      k_context_wordnum: 4,
      language: 'en',
      t_column: 'Address (Street Name)',
      t_context: '13-28, Dolmun-ro 95beon-gil, Gimpo-si, Gyeonggi-do, Republic of Korea',
      t_wordnum: 8,
      lengthtype: 4
    },
    {
      k_column: '대표번호',
      k_context: '031-983-0714',
      k_context_wordnum: 1,
      language: 'en',
      t_column: 'Phone Number',
      t_context: '031-983-0714',
      t_wordnum: 1,
      lengthtype: 2
    },
    {
      k_column: '이용시간',
      k_context: '전화문의',
      k_context_wordnum: 1,
      language: 'en',
      t_column: 'Opening Hours',
      t_context: 'Please Call',
      t_wordnum: 2,
      lengthtype: 1
    },
    {
      k_column: '휴무일',
      k_context: '전화문의',
      k_context_wordnum: 1,
      language: 'en',
      t_column: 'Holidays',
      t_context: 'Please Call',
      t_wordnum: 2,
      lengthtype: 1
    },
    {
      k_column: '입장료/시설이용료',
      k_context: '없음',
      k_context_wordnum: 1,
      language: 'en',
      t_column: 'Admission Fee',
      t_context: 'None.',
      t_wordnum: 1,
      lengthtype: 1
    },
    {
      k_column: '주차시설 유무',
      k_context: '없음',
      k_context_wordnum: 1,
      language: 'en',
      t_column: 'Parking Available',
      t_context: 'None.',
      t_wordnum: 1,
      lengthtype: 1
    },
    {
      k_column: '체험프로그램',
      k_context: '없음',
      k_context_wordnum: 1,
      language: 'en',
      t_column: 'Experience Program(s)',
      t_context: 'None.',
      t_wordnum: 1,
      lengthtype: 1
    }
  ]
}

   */
}
