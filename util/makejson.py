import sys

def record(cols, row):
    lenth = len(cols)
    cont = row.split()
    ret = "{"
    ret += '"' + cols[0] + '"' + ':'
    ret += '"' + cont[0] + '"'
    i = 1
    for c in cont[1:]:
        if i >= lenth:
            break
        ret += ','
        ret += '"' + cols[i] + '"' + ':'
        ret += '"' + c + '"'
        i += 1
    ret += '}'
    return ret

def makejson(cols, content):
    ret = "["
    rows = content.splitlines()
    ret += record(cols, rows[0])
    for line in rows[1:]:
        ret += ','
        ret += record(cols, line)
    ret += "]"
    return ret

def runtest():
    f = open('entity.txt','r')
    text = f.read()
    f.close()
    f = open('entity.json','w')
    cols = ['r1','r2','r3']
    f.write(makejson(cols,text))
    f.close()

def run():
    cols = sys.argv[1].split()
    return makejson(cols, sys.argv[2])
    #print sys.argv[1] + ' ' + sys.argv[2]

#runtest()
print run()
