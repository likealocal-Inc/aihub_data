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
            isSeoul = False
            data = {}
            with open(directory+"/"+f, 'r') as jsonfile:
                json_data = json.loads(jsonfile.read())
                data["poi_id"] = json_data["data"]["POI_id"]
                infos = json_data["annotations"]

                elseInfo = {}
                for info in infos:
                    # ["관광타입", "관광지명", "주소(도로명)", "대표번호", "이용시간",
                    # "휴무일", "입장료/시설이용료", "주차시설 유무", "체험프로그램",
                    # "주소(지번주소)", "주소", "개요", "리뷰키워드", "시설명",
                    # "업소명", "퇴실시간", "홈페이지 주소", "영업시간", "음식점명",
                    # "입실시간", "취급메뉴", "대표번호(고객문의용)", "객실정보"]
                    try:
                        if info["k_column"].startswith('관광타입'):
                            data["type"] = info["t_context"]
                            data["lang"] = info["language"]
                        elif info["k_column"].startswith('주소'):
                            data["addr"] = info["t_context"]
                        elif info["k_column"].startswith('업소명') or info["k_column"].startswith('시설명') or info["k_column"].startswith('관광지명') or info["k_column"].startswith('음식점명'):
                            data["name"] = info["t_context"]
                        else:
                            elseInfo[info["t_column"]] = info["t_context"]
                    except:
                        print("!!!!")

            if isSeoul == False:
                data["else_data"] = elseInfo
                seoul.append(data)
    for d in dirs:
        print(d)
        # if str(d).startswith("Training") or str(d).startswith("Validation") or str(d).startswith("02") or str(d).startswith("TL") or str(d).startswith("VL"):
        # if str(d).startswith("Training") or str(d).startswith("02") or str(d).startswith("TL"):
        if str(d).startswith("Validation") or str(d).startswith("02") or str(d).startswith("VL"):
            # if str(d).startswith("Validation") or str(d).startswith("02") or str(d).startswith("VL"):
            get_dirs(directory+"/"+d)


def make_file():
    f = open(os.getcwd()+"/data/res_lang_02.json", 'w', encoding="UTF-8")
    f.write(json.dumps(seoul, ensure_ascii=False))
    f.close()


get_dirs(now_directory)
make_file()
print('end')
