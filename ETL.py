from pymongo import MongoClient
from registro import Registro
from util import Util
from pprint import pprint as pp
import re
import psycopg2
import sys

connection = MongoClient("mongodb://localhost/myosotis")

db = connection.myosotis.registrocrawler1
resultsCrawler1 = db.find()

db = connection.myosotis.registrocrawler2
resultsCrawler2 = db.find()

db = connection.myosotis.registrocrawler5
resultsCrawler5 = db.find()

connection.close()
count=0
arrayObjeto = []
reg = dict()

def extractAndTransform():
    dataDesaparecimentoRegex = re.compile('Data do desaparecimento:')
    localDesaparecimentoRegex = re.compile('Local do desaparecimento:')
    dddDesaparecimentoRegex = re.compile('\([0-9]+')
    
    for record in resultsCrawler1:
        nome = record['nome'].replace('\'','')
        nome=nome.lower()
        img = record['img'].replace('\'','"') if 'img' in record.keys() else ''
        sexo = record['sexo'].replace('\'','')
        observacao = record['observacao'].replace('\'','')
        dataDesaparecimento = record['dataDesaparecimento'].replace('\'','')
        localDesaparecimento = record['local'].replace('\'','')
        
        reg.update({nome: nome})
        objeto = Registro(nome, img, sexo, dataDesaparecimento, localDesaparecimento, observacao)
      
        try:
            reg.update({nome: objeto})
        except KeyError:
            reg[nome] = objeto
        
    print(len(reg))
    
    
    for record in resultsCrawler2:
        nome = record['nome'].replace('\'','')
        nome=nome.lower()
        img = record['img'].replace('\'','"') if 'img' in record.keys() else ''
        sexo = record['sexo'].replace('\'','')
        observacao = record['observacao'].replace('\'','')
        dataDesaparecimento = record['dataDesaparecimento'].replace('\'','')
        dddDesaparecimento = dddDesaparecimentoRegex.match(record['telContato'])
        
        if dddDesaparecimento != None:
            dddDesaparecimento = dddDesaparecimento.group().replace('(', '')
            localDesaparecimento = Util.mapDDD(dddDesaparecimento)
        else:
            localDesaparecimento = ''
            
        objeto = Registro(nome, img, sexo, dataDesaparecimento, localDesaparecimento, observacao)
      
        try:
            reg.update({nome: objeto})
        except KeyError:
            reg[nome] = objeto
        
    print(len(reg))
    
    
    for record in resultsCrawler5:
        nome = record['nome'].replace('\'','')
        nome=nome.lower()
        img = record['img'].replace('\'','"') if 'img' in record.keys() else ''
        info = record['informacoes'].replace('\'','')
        dataDesaparecimento=''
        localDesaparecimento='RS'
        
        arrayInfo = info.split('$$$$')
        
        for r in arrayInfo:
            if dataDesaparecimentoRegex.match(r) != None:
                dataDesaparecimento = r
            if localDesaparecimentoRegex.match(r) != None:
                localDesaparecimento = r
        
        objeto = Registro(nome, img, sexo, dataDesaparecimento, localDesaparecimento, observacao)
      
        try:
            reg.update({nome: objeto})
        except KeyError:
            reg[nome] = objeto
    
    print(len(reg)) #Quantidade de registros coletados com nomes diferentes
    #pp(reg['breno augusto rocha'].localDesaparecimento)
    load()

def load():
    conn_string = "host='localhost' dbname='banco' user='usuario' password='senha'"
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()
    print ("Connected!")
    for k in reg.keys():
        #query =  "INSERT INTO registro (nome, imagem, sexo, data_desaparecimento, local_desaparecimento, observacao) VALUES (%s, %s, %s, %s, %s, %s);"
        values = "'{}', '{}', '{}', '{}', '{}', '{}'".format(reg[k].nome, reg[k].imagem, reg[k].sexo, reg[k].dataDesaparecimento, reg[k].localDesaparecimento, reg[k].observacao)
        query = "INSERT INTO registro (nome, imagem, sexo, data_desaparecimento, local_desaparecimento, observacao) VALUES ({});".format(values)
        cursor.execute(query)
        conn.commit()
    print("Processo de ETL concluído!")

extractAndTransform()