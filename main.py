#!/usr/bin/python
import psycopg2
import sys
 
def main():
    conn_string = "host='localhost' dbname='tccdb' user='raul' password='raulrafa'"
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()
    print ("Connected!")
    query =  "INSERT INTO registro (nome, imagem, sexo, data_desaparecimento, local_desaparecimento, observacao) VALUES ('Jhon', 'http://www.gameofthrones', 'M', '20/06/2015', 'RS', 'O adolescente saiu de casa no dia 12/09/02, por volta das 19:00 hs, dizendo que havia arranjado um emprego e não mais retornou.');"
    cursor.execute(query)
    conn.commit()
    
if __name__ == "__main__":
	main()
 

    #cursor.execute(query, data)

