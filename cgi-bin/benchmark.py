from joblib import Parallel, delayed  
import multiprocessing
import numpy as np
from timeit import Timer
import psycopg2
import sys
import numpy as np
import scipy.stats                  # Para o kernel density estimation
import cgi, cgitb 
cgitb.enable()  # debug


#sequencial
#print json_list(recuperaArrayPDF(kernel, values))
#t = Timer(lambda:json_list(recuperaArrayPDF(kernel, values))
#print t.timeit(number=1)

#paralelo
#print Parallel(n_jobs=numThreads, backend="threading")(delayed(recuperaArrayPDFParalelo)(j) for j in limite)
#t = Timer(lambda: Parallel(n_jobs=numThreads, backend="threading")(delayed(recuperaArrayPDFParalelo)(j) for j in limite))
#print t.timeit(number=1)
