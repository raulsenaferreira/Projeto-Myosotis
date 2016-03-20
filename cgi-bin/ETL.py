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

db = connection.myosotis.registrocrawler6
resultsCrawler6 = db.find()

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
        
        imagem = record['img'].replace('\'','"').strip() if 'img' in record.keys() else ''

        sexo = record['sexo'].replace('\'','')
        sexo = sexo.lower().replace('sexo:','').replace('masculino', 'M').replace('feminino', 'F').strip()
        
        olhos = record['olhos'].lower().replace('olhos:','').strip()
        corDaPele = record['corDaPele'].lower().replace('cor da pele:','').strip()
        cabelo=record['cabelo'].lower().replace('cabelos:','').strip()
        pesoAproximado = record['pesoAproximado'].lower().replace('peso aproximado:','').strip()
        alturaAproximada = record['alturaAproximada'].lower().replace('altura aproximada:','').strip()
        tipoFisico = record['tipoFisico'].lower().replace('tipo físico:','').strip()
        transtornoMental = record['transtornoMental'].lower().replace('tem algum tipo de transtorno mental?','').strip()
        idade = record['idadeHoje'].lower().replace('idade hoje:','').strip()
        dataNascimento = ''
        
        dataDesaparecimentoOrig = record['dataDesaparecimento'].replace('\'','').replace('Desapareceu em ','').strip()
        diasDesaparecido = dataDesaparecimentoOrig.split('(')[1].replace(')','')
        
        dataDesaparecimento = dataDesaparecimentoRegexSite1.match(dataDesaparecimentoOrig)
        if dataDesaparecimento != None:
            dataDesaparecimento = dataDesaparecimento.group().strip()
        else:
            dataDesaparecimento = dataDesaparecimentoOrig
        
        localDesaparecimento = record['local'].replace('\'','').replace('.','').strip()
        localDesaparecimento = localDesaparecimento.split('/')
        bairroDesaparecimento = ''
        cidadeDesaparecimento=''
        ufDesaparecimento=''
        if len(localDesaparecimento) > 2:
            bairroDesaparecimento = localDesaparecimento[0]
            cidadeDesaparecimento = localDesaparecimento[1]
            ufDesaparecimento = localDesaparecimento[2]
        elif len(localDesaparecimento) == 2:
            cidadeDesaparecimento = localDesaparecimento[0]
            ufDesaparecimento = localDesaparecimento[1]
            
        marcaCaracteristica = ''
        status = record['status']
        informacoes = record['observacao'].replace('\'','').strip()
        boletimOcorrencia = record['boletimOcorrencia'].lower().replace('foi feito boletim de ocorrência do caso?','').strip()
        fonte = record['fonte']+' '
        
        
        reg.update({nome: nome})
        objeto = Registro(nome, imagem, sexo, olhos, corDaPele, cabelo, pesoAproximado, alturaAproximada, tipoFisico, transtornoMental, idade, dataNascimento, diasDesaparecido, dataDesaparecimento, bairroDesaparecimento, cidadeDesaparecimento, ufDesaparecimento, marcaCaracteristica, status, informacoes, boletimOcorrencia, fonte)
      
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
        
        imagem = record['img'].replace('\'','"').strip() if 'img' in record.keys() else ''
        
        sexo = record['sexo'].replace('\'','').strip()
        olhos = record['olhos'].replace('\'','').strip()
        corDaPele = record['raca'].strip()
        cabelo = cabelo=record['cabelo'].lower().strip()
        pesoAproximado = record['pesoAproximado'].strip()  if record['pesoAproximado'].strip() != '0' else ''
        alturaAproximada = record['alturaAproximada'].strip()  if record['alturaAproximada'].strip() != '0' else ''
        tipoFisico = ''
        transtornoMental = ''
        
        dataNascimento = record['dataNascimento'].replace('\'','').strip()
        idade = ''#fazer metodo pra calcular a idade
        
        dataDesaparecimento = record['dataDesaparecimento'].replace('\'','').strip()
        diasDesaparecido = ''#fazer metodo pra calcular os dias de desaparecimento
        
        dddDesaparecimento = dddDesaparecimentoRegex.match(record['telContato'])
        bairroDesaparecimento = ''
        ufDesaparecimento = ''
        cidadeDesaparecimento = ''
        
        if dddDesaparecimento != None:
            dddDesaparecimento = dddDesaparecimento.group().replace('(', '')
            ufDesaparecimento = Util.mapDDD(dddDesaparecimento)
        
        marcaCaracteristica = ''
        status = record['status'].strip()
        informacoes = record['observacao'].replace('\'','').strip()
        boletimOcorrencia = ''#fazer metodo pra verificar no email de contato se eh de algum orgao responsavel, assim, provavelmente tem B.O.
        fonte = record['fonte'].strip()+' '
        
        try:
            if reg[nome].imagem=='': reg[nome].imagem = imagem 
            if reg[nome].sexo=='' : reg[nome].sexo = sexo 
            if reg[nome].olhos=='': reg[nome].olhos = olhos 
            if reg[nome].corDaPele=='': reg[nome].corDaPele = corDaPele 
            if reg[nome].cabelo=='': reg[nome].cabelo = cabelo 
            if reg[nome].pesoAproximado=='': reg[nome].pesoAproximado = pesoAproximado 
            if reg[nome].alturaAproximada=='': reg[nome].alturaAproximada = alturaAproximada 
            if reg[nome].tipoFisico=='': reg[nome].tipoFisico = tipoFisico 
            if reg[nome].transtornoMental=='': reg[nome].transtornoMental = transtornoMental 
            if reg[nome].dataNascimento=='': reg[nome].dataNascimento = dataNascimento 
            if reg[nome].idade=='': reg[nome].idade = idade 
            if reg[nome].dataDesaparecimento=='': reg[nome].dataDesaparecimento = dataDesaparecimento 
            if reg[nome].diasDesaparecido=='': reg[nome].diasDesaparecido = diasDesaparecido
            if reg[nome].bairroDesaparecimento=='': reg[nome].bairroDesaparecimento = bairroDesaparecimento
            if reg[nome].cidadeDesaparecimento=='': reg[nome].cidadeDesaparecimento = cidadeDesaparecimento 
            if reg[nome].ufDesaparecimento=='': reg[nome].ufDesaparecimento = ufDesaparecimento
            if reg[nome].marcaCaracteristica=='': reg[nome].marcaCaracteristica = marcaCaracteristica
            if reg[nome].status=='': reg[nome].status = status
            if reg[nome].informacoes=='': reg[nome].informacoes = informacoes
            if reg[nome].boletimOcorrencia=='': reg[nome].boletimOcorrencia = boletimOcorrencia
            reg[nome].fonte+=fonte 
        
        except KeyError:
            objeto = Registro(nome, imagem, sexo, olhos, corDaPele, cabelo, pesoAproximado, alturaAproximada, tipoFisico, transtornoMental, idade, dataNascimento, diasDesaparecido, dataDesaparecimento, bairroDesaparecimento, cidadeDesaparecimento, ufDesaparecimento, marcaCaracteristica, status, informacoes, boletimOcorrencia, fonte)
            reg[nome] = objeto
        
    #print(len(reg))
    
    
    
    #ETL for Site 5
    dataDesaparecimentoRegex = re.compile('Data do desaparecimento:')
    localDesaparecimentoRegex = re.compile('[lL]ocal do desaparecimento:|[dD]esapareceu de|[dD]esapareceu do|[dD]esapareceu da|[dD]esapareceu em|[dD]esapareceu no')
    corDaPeleRegex = re.compile('Cor|cor')
    sexoRegex = re.compile('Sexo|sexo')
    
    for record in resultsCrawler5:
        nome = record['nome'].replace('\'','').strip()
        nome=nome.lower()
        
        imagem = record['img'].replace('\'','"').strip() if 'img' in record.keys() else ''
        
        sexo = ''
        olhos = ''
        corDaPele = ''
        cabelo = ''
        pesoAproximado = ''
        alturaAproximada = ''
        corDaPele = ''
        tipoFisico = ''
        transtornoMental = ''
        idade = ''
        dataNascimento = ''
        diasDesaparecido = ''
        dataDesaparecimento =''
        bairroDesaparecimento =''
        cidadeDesaparecimento =''
        ufDesaparecimento ='RS' 
        marcaCaracteristica =''
        informacoes =''
        boletimOcorrencia =''
        
        info = record['informacoes'].replace('\'','').strip()
        
        fonte = record['fonte'].strip()+' '
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
            if sexoRegex.match(r) != None:
                sexo = r.replace('Sexo:','').strip().lower().replace('masculino', 'M').replace('feminino', 'F')
                
        status = record['status'].strip()
        
        try:
            if reg[nome].imagem=='': reg[nome].imagem = imagem 
            if reg[nome].sexo=='' : reg[nome].sexo = sexo 
            if reg[nome].olhos=='': reg[nome].olhos = olhos 
            if reg[nome].corDaPele=='': reg[nome].corDaPele = corDaPele 
            if reg[nome].cabelo=='': reg[nome].cabelo = cabelo 
            if reg[nome].pesoAproximado=='': reg[nome].pesoAproximado = pesoAproximado 
            if reg[nome].alturaAproximada=='': reg[nome].alturaAproximada = alturaAproximada 
            if reg[nome].tipoFisico=='': reg[nome].tipoFisico = tipoFisico 
            if reg[nome].transtornoMental=='': reg[nome].transtornoMental = transtornoMental 
            if reg[nome].dataNascimento=='': reg[nome].dataNascimento = dataNascimento 
            if reg[nome].idade=='': reg[nome].idade = idade 
            if reg[nome].dataDesaparecimento=='': reg[nome].dataDesaparecimento = dataDesaparecimento 
            if reg[nome].diasDesaparecido=='': reg[nome].diasDesaparecido = diasDesaparecido
            if reg[nome].bairroDesaparecimento=='': reg[nome].bairroDesaparecimento = bairroDesaparecimento
            if reg[nome].cidadeDesaparecimento=='': reg[nome].cidadeDesaparecimento = cidadeDesaparecimento 
            if reg[nome].ufDesaparecimento=='': reg[nome].ufDesaparecimento = ufDesaparecimento
            if reg[nome].marcaCaracteristica=='': reg[nome].marcaCaracteristica = marcaCaracteristica
            if reg[nome].status=='': reg[nome].status = status
            if reg[nome].informacoes=='': reg[nome].informacoes = informacoes
            if reg[nome].boletimOcorrencia=='': reg[nome].boletimOcorrencia = boletimOcorrencia
            reg[nome].fonte+=fonte 
        
        except KeyError:
            objeto = Registro(nome, imagem, sexo, olhos, corDaPele, cabelo, pesoAproximado, alturaAproximada, tipoFisico, transtornoMental, idade, dataNascimento, diasDesaparecido, dataDesaparecimento, bairroDesaparecimento, cidadeDesaparecimento, ufDesaparecimento, marcaCaracteristica, status, informacoes, boletimOcorrencia, fonte)
            reg[nome] = objeto
            
            
            
    #ETL for Site 6
    for record in resultsCrawler6:
        nome = record['nome'].replace('\'','').strip()
        nome=nome.lower()
        
        imagem = record['img'].replace('\'','"').strip() if 'img' in record.keys() else ''
        
        idade = record['idade'].strip()
        dataNascimento = record['dataNascimento'].strip()
        informacoes = record['informacoes'].replace('\'','').strip()
        dataDesaparecimento=record['dataDesaparecimento'].strip()
        diasDesaparecido=record['diasDesaparecido'].strip()
        sexo=record['sexo'].strip()
        pesoAproximado = record['pesoAproximado'].strip()
        alturaAproximada=record['alturaAproximada'].strip()
        olhos=record['olhos'].strip()
        corDaPele=record['corDaPele'].strip()
        marcaCaracteristica=record['observacao'].strip()
        cabelo=record['cabelo'].strip()
        
        local=record['local'].strip()
        local = local.split(',')
        ufDesaparecimento=''
        cidadeDesaparecimento=''
        bairroDesaparecimento=''
        if len(local)==2:
            ufDesaparecimento=local[1].strip()
            cidadeDesaparecimento=local[0].strip()
        elif len(local)==3:
            ufDesaparecimento=local[2].strip()
            cidadeDesaparecimento=local[1].strip()
            bairroDesaparecimento=local[0].strip()
        
        fonte = record['fonte'].strip()+' '
        status = record['status'].strip()
        
        try:
            if reg[nome].imagem=='': reg[nome].imagem = imagem 
            if reg[nome].sexo=='' : reg[nome].sexo = sexo 
            if reg[nome].olhos=='': reg[nome].olhos = olhos 
            if reg[nome].corDaPele=='': reg[nome].corDaPele = corDaPele 
            if reg[nome].cabelo=='': reg[nome].cabelo = cabelo 
            if reg[nome].pesoAproximado=='': reg[nome].pesoAproximado = pesoAproximado 
            if reg[nome].alturaAproximada=='': reg[nome].alturaAproximada = alturaAproximada 
            if reg[nome].tipoFisico=='': reg[nome].tipoFisico = tipoFisico 
            if reg[nome].transtornoMental=='': reg[nome].transtornoMental = transtornoMental 
            if reg[nome].dataNascimento=='': reg[nome].dataNascimento = dataNascimento 
            if reg[nome].idade=='': reg[nome].idade = idade 
            if reg[nome].dataDesaparecimento=='': reg[nome].dataDesaparecimento = dataDesaparecimento 
            if reg[nome].diasDesaparecido=='': reg[nome].diasDesaparecido = diasDesaparecido
            if reg[nome].bairroDesaparecimento=='': reg[nome].bairroDesaparecimento = bairroDesaparecimento
            if reg[nome].cidadeDesaparecimento=='': reg[nome].cidadeDesaparecimento = cidadeDesaparecimento 
            if reg[nome].ufDesaparecimento=='': reg[nome].ufDesaparecimento = ufDesaparecimento
            if reg[nome].marcaCaracteristica=='': reg[nome].marcaCaracteristica = marcaCaracteristica
            if reg[nome].status=='': reg[nome].status = status
            if reg[nome].informacoes=='': reg[nome].informacoes = informacoes
            if reg[nome].boletimOcorrencia=='': reg[nome].boletimOcorrencia = boletimOcorrencia
            reg[nome].fonte+=fonte 
        
        except KeyError:
            objeto = Registro(nome, imagem, sexo, olhos, corDaPele, cabelo, pesoAproximado, alturaAproximada, tipoFisico, transtornoMental, idade, dataNascimento, diasDesaparecido, dataDesaparecimento, bairroDesaparecimento, cidadeDesaparecimento, ufDesaparecimento, marcaCaracteristica, status, informacoes, boletimOcorrencia, fonte)
            reg[nome] = objeto
    
    
    #print(len(reg)) #Quantidade de registros coletados com nomes diferentes
    #load to database
    load()

              
              
              
def load():
    conn_string = "host='localhost' dbname='banco' user='usuario' password='senha'"
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()
    print ("Connected!")
    
    for k in reg.keys():
        values = "'{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}'".format(reg[k].nome, reg[k].imagem, reg[k].sexo, reg[k].olhos, reg[k].corDaPele, reg[k].cabelo, reg[k].pesoAproximado, reg[k].alturaAproximada, reg[k].tipoFisico, reg[k].transtornoMental, reg[k].idade, reg[k].dataNascimento, reg[k].diasDesaparecido, reg[k].dataDesaparecimento, reg[k].bairroDesaparecimento, reg[k].cidadeDesaparecimento, reg[k].ufDesaparecimento, reg[k].marcaCaracteristica, reg[k].status, reg[k].informacoes, reg[k].boletimOcorrencia, reg[k].fonte)
        query = "INSERT INTO registro (nome, imagem, sexo, olhos, cor_da_pele, cabelo, peso_aproximado, altura_aproximada, tipo_fisico, transtorno_mental, idade, data_nascimento, dias_desaparecido, data_desaparecimento, bairro_desaparecimento, cidade_desaparecimento, uf_desaparecimento, marca_caracteristica, status, informacoes, boletim_ocorrencia, fonte) VALUES ({});".format(values)
        cursor.execute(query)
        conn.commit()
        
    print("Processo de ETL concluído!")


extractAndTransform()