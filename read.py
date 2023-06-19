import os
import json

now_directory = os.getcwd()+"/data"

f = open(now_directory+"/res.json", "r")
while True:
    line = f.readline()
    if not line:
        break
    print(line)
f.close()
