import zipfile
import csv
import os
import json

now_directory = os.getcwd()+"/data"

seoul = []


def get_files(directory):
    return [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]


def get_dirs(directory):
    dirs = [f for f in os.listdir(directory) if os.path.isdir(
        os.path.join(directory, f))]

    files = get_files(directory)

    for f in files:

        if (str(f).endswith(".json")):
            pass
        if (str(f).endswith(".csv")):
            print(f)
            data = {}
            with open(directory+"/"+f, 'r', newline='') as csvfile:
                reader = csv.reader(csvfile)
                header = next(reader)
                data["poi_id"] = header[1]

                for line in reader:

                    if line[0] == '관광타입':
                        data["type"] = line[1]
                    elif line[0] == '주소(도로명)':
                        data["addr"] = line[1]
                    elif line[0] == '관광지명' or line[0] == '업소명' or line[0] == '시설명' or line[0] == '관광지명' or line[0] == '음식점명':
                        data["name"] = line[1]
                    elif line[0] == '대표번호':
                        data["phone"] = line[1]
                    elif line[0] == '이용시간':
                        data["using_date"] = line[1]
                    elif line[0] == '휴무일':
                        data["holiday"] = line[1]
                    elif line[0] == '입장료/시설이용료':
                        data["free"] = line[1]
                    elif line[0] == '주차시설 유무':
                        data["parking"] = line[1]
                    elif line[0] == '체험프로그램':
                        data["program"] = line[1]
                    else:
                        data[line[0]] = line[1]
                seoul.append(data)

    for d in dirs:
        if str(d).startswith("Training") or str(d).startswith("Validation") or str(d).startswith("01") or str(d).startswith("TS") or str(d).startswith("VS"):
            get_dirs(directory+"/"+d)


def make_file():
    f = open(os.getcwd()+"/data/res20230619.json", 'w', encoding="UTF-8")
    f.write(json.dumps(seoul, ensure_ascii=False))
    f.close()


get_dirs(now_directory)
make_file()
print('end')
