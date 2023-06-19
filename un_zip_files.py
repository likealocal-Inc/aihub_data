import zipfile
import os

now_directory = os.getcwd()


def get_files(directory):
    return [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]
    # return os.listdir(directory)


def de_zip(dir, file):
    file_zip = zipfile.ZipFile(dir+"/"+file+".zip")
    file_zip.extract(path=dir)
    file_zip.close()


def get_dirs(directory):
    dirs = [f for f in os.listdir(directory) if os.path.isdir(
        os.path.join(directory, f))]
    files = get_files(directory)
    for f in files:
        if (str(f).endswith(".zip")):
            file_path = directory+"/"+f

            un_zip_folder = directory+"/"+str(f).replace(".zip", '')

            if os.path.exists(un_zip_folder) and os.path.isdir(un_zip_folder):
                print("이미존재 : " + un_zip_folder)
            else:
                with zipfile.ZipFile(file_path, 'r') as zip_ref:
                    print('압축푸는중...' + file_path)
                    zip_ref.extractall(un_zip_folder)

    for d in dirs:
        if str(d).startswith("Training") or str(d).startswith("Validation") or str(d).startswith("01") or str(d).startswith("02"):
            print("directory: " + d)
            get_dirs(directory+"/"+d)


get_dirs(now_directory)
