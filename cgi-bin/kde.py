from joblib import Parallel, delayed
import multiprocessing
import psycopg2
import sys
import numpy as np
import scipy.stats  # Para o kernel density estimation
import cgi, cgitb
import hashlib
import os
#import redis

cgitb.enable()  # debug

script_dir = os.path.dirname(__file__)
rel_path = "config.txt"
abs_file_path = os.path.join(script_dir, rel_path)
connParams = [line.rstrip('\n') for line in open(abs_file_path)]

CDFs = -1
allowRedisCaching = False
allowParallelKDEProcessing = False

data = cgi.FieldStorage()

latitude = []
longitude = []
estado = []

try:
    dataFromPHP = sys.argv[1]
except:
    print "ERROR"
    sys.exit(1)

if allowRedisCaching:
    #verifica se essa consulta ja esta em cache
    redis = redis.Redis('localhost')
    chave = hashlib.md5(dataFromPHP).hexdigest()
    if(redis.get(chave)):
    	print redis.get(chave)
    else:
    	#substitua com os dados do seu banco
    	try:
    		conn = psycopg2.connect(connParams[0])
    	except:
    		print "Nao conectou!"
else:
    try:
        conn = psycopg2.connect(connParams[0])
    except:
        print "Nao conectou!"

#database operations
cur = conn.cursor()

cur.execute(dataFromPHP)
linhas = cur.fetchall()

cur.close()
conn.close()

def pegaLatLonUF(linhas):
	for linha in linhas:
		latitude.append( float(linha[0]) )
		longitude.append( float(linha[1]) )
		estado.append(linha[2])
	return latitude, longitude, estado

m1, m2, uf = pegaLatLonUF(linhas)

values = np.vstack([m1, m2])

tam = len(values[0])
limite = range(tam)
fator = 5000

#Calculo do KDE
kernel = scipy.stats.kde.gaussian_kde(values)

def recuperaArrayPDFParalelo(j):
    return kernel.evaluate(np.vstack([values[0][j], values[1][j]]))[0]*fator

def recuperaArrayPDF(kernel, values, estados):
	lst = {}
	for j in range(tam):
		PDF = kernel.evaluate(np.vstack([values[0][j], values[1][j]]))[0]*fator
		nomeEstado = str(estados[j])
		try:
			lst[nomeEstado] = (PDF+lst[nomeEstado])
		except KeyError:
			lst[nomeEstado] = PDF
	return lst

if allowParallelKDEProcessing:
    #Paralelo
    if tam < 1000:
    	numThreads = 1
    else:
    	numThreads = tam/1000
    CDFs = Parallel(n_jobs=numThreads, backend="threading")(delayed(recuperaArrayPDFParalelo)(j) for j in limite)
else:
    #Sequencial
    CDFs = recuperaArrayPDF(kernel, values, uf)

if allowRedisCaching:
    #grava a nova consulta no redis (cache)
    redis.set(chave, CDFs)

#resultado enviado
print CDFs
