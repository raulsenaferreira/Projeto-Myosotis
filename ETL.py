from pymongo import MongoClient
from registro import Registro

connection = MongoClient("mongodb://localhost/test_myosotis")

db = connection.test_myosotis.registrocrawler1
resultsCrawler1 = db.find()

db = connection.test_myosotis.registrocrawler2
resultsCrawler2 = db.find()

db = connection.test_myosotis.registrocrawler5
resultsCrawler5 = db.find()

connection.close()
count=0
arrayObjeto = []
reg = dict()

for record in resultsCrawler1:
    nome = record['nome'].lower
    img = record['img'] if 'img' in record.keys() else ''
    sexo = record['sexo']
    observacao = record['observacao']
    dataDesaparecimento = record['dataDesaparecimento']
    reg.update({nome: nome})
    objeto = Registro(nome, img, sexo, dataDesaparecimento, observacao)
    arrayObjeto.append(objeto)
    count+=1
    '''
    try:
        arrayOfDictionaries[token].append(key)
        arrayOfDictionaries.update({token:arrayOfDictionaries[token]})
    except KeyError:
        tokenList.append(key)
        arrayOfDictionaries.update({token:tokenList})
    '''
for record in resultsCrawler2:
    nome = record['nome'].lower
    img = record['img'] if 'img' in record.keys() else ''
    sexo = record['sexo']
    observacao = record['observacao']
    dataDesaparecimento = record['dataDesaparecimento']
    reg.update({nome: nome})
    objeto = Registro(nome, img, sexo, dataDesaparecimento, observacao)
    arrayObjeto.append(objeto)
    count+=1

for record in resultsCrawler5:
    nome = record['nome'].lower
    img = record['img'] if 'img' in record.keys() else ''
    info = record['informacoes']
    arrayInfo = info.split('$$$$')
    reg.update({nome: nome})
    count+=1

    '''
    observacao = record['observacao']
    dataDesaparecimento = record['dataDesaparecimento']
    
    objeto = Registro(nome, img, sexo, dataDesaparecimento, observacao)
    arrayObjeto.append(objeto)
    '''
print(len(reg))
print(count)
f=dict()
r = "Raull"
f.insert({nome:r})
r = "RAUL"
f.update({nome:r})
print(len(f))
#print(len(arrayObjeto))
#print (arrayObjeto[3105].observacao)