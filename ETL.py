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
    #ETL for Site 1
    dataDesaparecimentoRegexSite1 = re.compile('[0-9]+/[0-9]+/[0-9]+')
    
    for record in resultsCrawler1:
        nome = record['nome'].replace('\'','').strip()
        nome=nome.lower()
        
        img = record['img'].replace('\'','"').strip() if 'img' in record.keys() else ''

        dataDesaparecimentoOrig = record['dataDesaparecimento'].replace('\'','').replace('Desapareceu em ','').strip()
        dataDesaparecimento = dataDesaparecimentoRegexSite1.match(dataDesaparecimentoOrig)
        if dataDesaparecimento != None:
            dataDesaparecimento = dataDesaparecimento.group().strip()
        else:
            dataDesaparecimento = dataDesaparecimentoOrig
        
        localDesaparecimento = record['local'].replace('\'','').replace('.','').strip()
        localDesaparecimento = localDesaparecimento.split('/')
        cidadeDesaparecimento = localDesaparecimento[0]
        ufDesaparecimento = localDesaparecimento[1]
        
        fonte = record['fonte']
        
        sexo = record['sexo'].replace('\'','')
        sexo = sexo.replace('Sexo:','').replace('Masculino', 'M').replace('Feminino', 'F').strip()
        
        corDaPele = record['corDaPele'].replace('Cor da pele:','').strip()
        observacao = record['observacao'].replace('\'','').strip()
        status = record['status']
        
        reg.update({nome: nome})
        objeto = Registro(nome, img, sexo, corDaPele, dataDesaparecimento, cidadeDesaparecimento, ufDesaparecimento, observacao, status, fonte)
      
        try:
            reg.update({nome: objeto})
        except KeyError:
            reg[nome] = objeto
        
    #print(len(reg))

    
    
    #ETL for Site 2
    dddDesaparecimentoRegex = re.compile('\([0-9]+')
    
    for record in resultsCrawler2:
        nome = record['nome'].replace('\'','').strip()
        nome=nome.lower()
        
        img = record['img'].replace('\'','"').strip() if 'img' in record.keys() else ''
        
        dataDesaparecimento = record['dataDesaparecimento'].replace('\'','').strip()
        
        dddDesaparecimento = dddDesaparecimentoRegex.match(record['telContato'])
        ufDesaparecimento = ''
        cidadeDesaparecimento = ''
        
        if dddDesaparecimento != None:
            dddDesaparecimento = dddDesaparecimento.group().replace('(', '')
            ufDesaparecimento = Util.mapDDD(dddDesaparecimento)
        
        fonte = record['fonte'].strip()
        sexo = record['sexo'].replace('\'','').strip()
        observacao = record['observacao'].replace('\'','').strip()
        corDaPele = record['raca'].strip()
        status = record['status'].strip()
        
        objeto = Registro(nome, img, sexo, corDaPele, dataDesaparecimento, cidadeDesaparecimento, ufDesaparecimento, observacao, status, fonte)
      
        try:
            reg.update({nome: objeto})
        except KeyError:
            reg[nome] = objeto
        
    #print(len(reg))
    
    
    
    #ETL for Site 5
    dataDesaparecimentoRegex = re.compile('Data do desaparecimento:')
    localDesaparecimentoRegex = re.compile('[lL]ocal do desaparecimento:|[dD]esapareceu de|[dD]esapareceu do|[dD]esapareceu da|[dD]esapareceu em|[dD]esapareceu no')
    corDaPeleRegex = re.compile('Cor|cor')
    
    for record in resultsCrawler5:
        nome = record['nome'].replace('\'','').strip()
        nome=nome.lower()
        
        img = record['img'].replace('\'','"').strip() if 'img' in record.keys() else ''
        
        info = record['informacoes'].replace('\'','').strip()
        dataDesaparecimento=''
        ufDesaparecimento='RS'
        cidadeDesaparecimento=''
        corDaPele=''
        fonte = record['fonte'].strip()
        arrayInfo = info.split('$$$$')
        
        for r in arrayInfo:
            if dataDesaparecimentoRegex.search(r) != None:
                dataDesaparecimento = r.replace('Data do desaparecimento:','').strip()
            if localDesaparecimentoRegex.match(r) != None:
                cidadeDesaparecimentoAux = r.replace('Local do desaparecimento:','').replace('Desapareceu de ','').replace('Desapareceu do ','').replace('Desapareceu da ','').replace('Desapareceu em ','').replace('Leia mais','').strip()
                cidadeDesaparecimentoAux = cidadeDesaparecimentoAux.split('/')
                cidadeDesaparecimentoAux = cidadeDesaparecimentoAux[0]
                cidadeDesaparecimento = cidadeDesaparecimentoAux.split('-')[0].strip()
            if corDaPeleRegex.match(r) != None:
                corDaPele = r.replace('Cor:','').strip()
                
        status = record['status'].strip()
        
        objeto = Registro(nome, img, sexo, corDaPele, dataDesaparecimento, cidadeDesaparecimento, ufDesaparecimento, observacao, status, fonte)
      
        try:
            reg.update({nome: objeto})
        except KeyError:
            reg[nome] = objeto
    
    #print(len(reg)) #Quantidade de registros coletados com nomes diferentes
    load()

def load():
    conn_string = "host='localhost' dbname='banco' user='usuario' password='senha'"
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()
    print ("Connected!")
    
    for k in reg.keys():
        values = "'{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}'".format(reg[k].nome, reg[k].imagem, reg[k].sexo, reg[k].corDaPele, reg[k].dataDesaparecimento, reg[k].cidadeDesaparecimento, reg[k].ufDesaparecimento, reg[k].observacao, reg[k].status, reg[k].fonte)
        query = "INSERT INTO registro (nome, imagem, sexo, cor_da_pele, data_desaparecimento, cidade_desaparecimento, uf_desaparecimento, observacao, status, fonte) VALUES ({});".format(values)
        cursor.execute(query)
        conn.commit()
        
    print("Processo de ETL concluído!")


extractAndTransform()