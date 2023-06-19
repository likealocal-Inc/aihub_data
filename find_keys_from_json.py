import zipfile
import csv
import os
import json

now_directory = os.getcwd()+"/data"

keys = []


def get_files(directory):
    return [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]


def get_dirs(directory):
    dirs = [f for f in os.listdir(directory) if os.path.isdir(
        os.path.join(directory, f))]

    files = get_files(directory)

    for f in files:
        if (str(f).endswith(".json")):
            with open(directory+"/"+f, 'r') as jsonfile:
                json_data = json.loads(jsonfile.read())
                infos = json_data["annotations"]

                # for info in infos:
                try:
                    if str(infos[1]["k_column"]) in keys:
                        pass
                    else:
                        keys.append(infos[1]["k_column"])
                except:
                    print('')

    for d in dirs:

        if str(d).startswith("Training") or str(d).startswith("Validation") or str(d).startswith("02") or str(d).startswith("TL") or str(d).startswith("VL"):
            print(d)
            get_dirs(directory+"/"+d)


get_dirs(now_directory)

print(json.dumps(keys,  ensure_ascii=False))
print('end')
