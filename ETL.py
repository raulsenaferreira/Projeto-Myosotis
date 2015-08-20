from pymongo import MongoClient
from registro import Registro
from pprint import pprint as pp
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
    nome = record['nome']
    nome=nome.lower()
    img = record['img'] if 'img' in record.keys() else ''
    sexo = record['sexo']
    observacao = record['observacao']
    dataDesaparecimento = record['dataDesaparecimento']
    reg.update({nome: nome})
    objeto = Registro(nome, img, sexo, dataDesaparecimento, observacao)
  
    try:
        reg.update({nome: objeto})
    except KeyError:
        reg[nome] = objeto
    '''
    try:
        arrayOfDictionaries[token].append(key)
        arrayOfDictionaries.update({token:arrayOfDictionaries[token]})
    except KeyError:
        tokenList.append(key)
        arrayOfDictionaries.update({token:tokenList})
    '''
print(len(reg))

for record in resultsCrawler2:
    nome = record['nome']
    nome=nome.lower()
    img = record['img'] if 'img' in record.keys() else ''
    sexo = record['sexo']
    observacao = record['observacao']
    dataDesaparecimento = record['dataDesaparecimento']
    
    objeto = Registro(nome, img, sexo, dataDesaparecimento, observacao)
  
    try:
        reg.update({nome: objeto})
    except KeyError:
        reg[nome] = objeto
    
print(len(reg))

for record in resultsCrawler5:
    nome = record['nome']
    nome=nome.lower()
    img = record['img'] if 'img' in record.keys() else ''
    info = record['informacoes']
    arrayInfo = info.split('$$$$')
    objeto = Registro(nome, img, sexo, dataDesaparecimento, observacao)
  
    try:
        reg.update({nome: objeto})
    except KeyError:
        reg[nome] = objeto

    '''
    observacao = record['observacao']
    dataDesaparecimento = record['dataDesaparecimento']
    
    objeto = Registro(nome, img, sexo, dataDesaparecimento, observacao)
    arrayObjeto.append(objeto)
    '''

print(len(reg)) #Quantidade de registros coletados com nomes diferentes
pp(reg['cintia luana ribeiro moraes'].dataDesaparecimento) #exemplo de acesso a um atributo de um objeto guardado
#pp(reg)
#print(len(arrayObjeto))
#print (arrayObjeto[3105].observacao)