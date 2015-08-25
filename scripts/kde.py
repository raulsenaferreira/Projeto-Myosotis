from joblib import Parallel, delayed  
import multiprocessing
import psycopg2
import sys
import numpy as np
import scipy.stats  # Para o kernel density estimation
import cgi, cgitb 
cgitb.enable()  # debug

data = cgi.FieldStorage()

latitude = []
longitude = []

dataFromPHP = ""
try:
    dataFromPHP = sys.argv[1]
except:
    print "ERROR"
    sys.exit(1)

#substitua com os dados do seu banco
try:
	conn = psycopg2.connect("host='107.170.124.51' dbname='tccdb_cloud' user='postgres' password='raul$0128$raul'")
except:
	print "Nao conectou!"

#database operations
cur = conn.cursor()

cur.execute(dataFromPHP)
linhas = cur.fetchall()

cur.close()
conn.close()

def pegaLatLon(linhas):
	for linha in linhas:
		latitude.append( float(linha[0]) )
		longitude.append( float(linha[1]) )
	return latitude, longitude

m1, m2 = pegaLatLon(linhas)

values = np.vstack([m1, m2])

tam = len(values[0])
limite = range(tam)
fator = 500 #Equivale a 5 no Matlab

#Calculo do KDE
kernel = scipy.stats.kde.gaussian_kde(values)

#Descomente o codigo abaixo se vc estiver usando uma maquina multicore e comente o codigo sequencial
#Paralelo
'''
if tam < 1000:
	numThreads = 1
else:
	numThreads = tam/1000

def recuperaArrayPDFParalelo(j):
	return kernel.evaluate(np.vstack([values[0][j], values[1][j]]))[0]*fator

print Parallel(n_jobs=numThreads, backend="threading")(delayed(recuperaArrayPDFParalelo)(j) for j in limite)
'''
#Sequencial
def recuperaArrayPDF(kernel, values):
	lst = []
	for j in range(tam):
		lst.append(kernel.evaluate(np.vstack([values[0][j], values[1][j]]))[0]*fator)
	return lst

print recuperaArrayPDF(kernel, values)