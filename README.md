Projeto-Myosotis
================
[![Build Status](https://travis-ci.org/raulsenaferreira/Projeto-Myosotis.svg)](https://travis-ci.org/raulsenaferreira/Projeto-Myosotis)
[![Coverage Status](https://coveralls.io/repos/raulsenaferreira/Projeto-Myosotis/badge.svg?branch=master&service=github)](https://coveralls.io/github/raulsenaferreira/Projeto-Myosotis?branch=master)

Um sistema crawler-based baseado em tecnologias NoSQL no auxílio a unificação e estudo dos registros de pessoas desaparecidas.

Uma versão beta do sistema poderá ser acessado no link: http://projeto-myosotis.com.br/

A versão beta da API contendo os dados em formato JSON pode ser acessado no link: http://projeto-myosotis.com.br:4000/collections/site`x`/all (troque x pelo numero da base de dados, que vai de 1 a 9)

A licença pra uso do sistema e dos dados da API é a [Apache](https://github.com/raulsenaferreira/Projeto-Myosotis/blob/master/LICENSE). Caso você queira usar o sistema como ele está ou modificar o sistema existente em experimentos ou qualquer outro tipo de trabalho, peço apenas que dê uma rápida olhada em [Termos de uso](#termos-de-uso).

##O Sistema

Este sistema coleta informações contidas em sites de pessoas desaparecidas e guarda em um banco de dados NoSQL, preservando a estrutura heterogênea dos dados. Depois, através de um processo de ETL simples feito em Python, elimina registros duplicados e extrai o máximo de informações do registro. Em seguida, essas informações de diferentes fontes sobre um determinado registro são agregados, unificando assim as informações da pessoa desaparecida e tornando a informação mais completa mantendo as fontes de onde as informações foram extraídas.

Por último, os dados são armazenados de forma estruturada em um banco de dados relacional, para posterior análise espacial e textual. O sistema dispõe também de um webservice, e permite que através de algumas URLs qualquer pessoa ou sistema possa consumir os dados "crawleados".

O sistema permite que se faça alguns tipos de consultas específicas como situação(desaparecido/encontrado), raça(branco, pardo, negro, amarelo e indígena), gênero(masculino e feminino), estado(estados do Brasil) ou nome. Além disso, as consultas são armazenadas em um banco NoSQL chave-valor, funcionando como um cache e deixando as consultas mais rápidas.

Ainda em fase experimental, está a coloração dos estados baseados na probabilidade de ocorrer um novo caso de desaparecimento naquele estado. O cálculo é feito com um método estatístico não paramétrico, conhecido como KDE(https://pt.wikipedia.org/wiki/Estimativa_de_densidade_kernel). Ferramentas de visualização em formato de cluster e polígonos também são utilizados, bem como ferramentas para geração de gráficos.

##Status of crawled sites
http://www.desaparecidos.gov.br [Online]

http://portal.mj.gov.br [Doesn't exist anymore]

http://www.desaparecidosdobrasil.org [Online]

http://www.desaparecidos.mg.gov.br [Online]

http://www.desaparecidos.rs.gov.br [Online]

http://www.biamap.com.br/ [Online]

http://www.desaparecidosbr.com.br/ [Online]

http://www.policiacivil.go.gov.br/pessoas-desaparecidas [Online]

http://www.divulgandodesaparecidos.org [Online]

##Como contribuir
Crie um branch e edite as partes que você julga necessário (P.S.: As issues do projeto são um bom lugar para começar).

Instale opcionalmente as dependências listadas abaixo caso queira visualizar as mudanças.

Envie um pull request para consideração, ele será muito bem vindo!

##Dependências
1. Instale o Postgres (http://www.postgresql.org/) e a extensão PostGIS (http://postgis.net/).
2. Instale Apache e PHP 5 e certifique-se de instalar o módulo do postgres no PHP (`sudo apt-get install php5-pgsql`)
2. Instale o Node.js (https://nodejs.org/en/) e o mongodb (https://www.mongodb.org/) em sua máquina
3. Instale o Redis (http://redis.io/)
4. Instale o módulo pymongo no python (http://api.mongodb.org/python/current/installation.html)
5. Instale o módulo psycopg2 (http://initd.org/psycopg/docs/install.html)
6. Instale o módulo de paralelização do python Joblib (`easy_install joblib`)
7. Instale a biblioteca de computação científica NumPy, SciPy e suas dependências (`sudo apt-get install python-numpy libblas-dev liblapack-dev gfortran python-dev`) (`sudo pip install numpy --upgrade`) (`sudo pip install scipy --upgrade`)
6. Execute no terminal `npm install` para baixar automaticamente todas as dependências do projeto
7. Execute o script "INSTALL.sql" contido na pasta raiz deste projeto
8. Altere o arquivo config.txt adicionando as credenciais de acesso ao banco postgres
9. *Você deve garantir nas configurações do apache que ninguém de fora da aplicação possa ver o arquivo config.txt,* um jeito eficiente é ir até `/etc/apache2/apache2.conf` e incluir a restrição pública ao arquivo
9. Certifique-se de colocar o projeto dentro de uma pasta que possa ser lida pelo Apache Web Server. Certifique-se também em ter instalado em sua máquina a versão 2.7.x do Python
10. Inicie o mongodb (mongod)
11. Para executar o crawler, vá na pasta raiz do projeto e digite na linha de comando (node crawler.js) ou caso queira apenas testar com alguns registros digite (node test-crawler.js)
12. Depois de ter crawleado todos os domínios pra dentro do MongoDB, basta entrar na pasta cgi-bin/ e executar o arquivo ETL.py para que seja feito o processo de ETL e gravação dos dados no Postgres
13. Para acessar a aplicação acesse em seu navegador http://localhost/Projeto-Myosotis/
14. Para acessar o webservice, primeiro inicie-o digitando na linha de comando(node API.js) digite http://localhost/Projeto-Myosotis:4000/collections/site1/all (a numeração vai de 1 até 6)

* As informações de latitude e longitude precisarão ser extraídas a partir dos endereços que o crawler conseguiu garimpar e colocar no banco de dados. Para isso você deverá geocodificar os endereços do banco mantendo o id do respectivo registro para posterior update no banco (o script de update está no arquivo INSTALL.sql).

* Para geocodificar você pode usar algumas ferramentas baseadas no batchgeo (https://pt.batchgeo.com/), google maps API (https://developers.google.com/maps/) ou alguma outra ferramenta de geocodificação se sua preferência, lembrando que para localizações no Brasil o formato de SRID deve ser 4674.

##Issues
https://github.com/raulsenaferreira/Projeto-Myosotis/issues

(#termos-de-uso)
##Termos de Uso
Este projeto foi desenvolvido com a intenção de ser open-source, para que o pesquisador ou desenvolvedor que tiver a intenção de fazer algo parecido, não comece do zero, e tenha a oportunidade ou de fundamentar seu trabalho tomando como baseline este projeto ou tenha a oportunidade de trabalhar em conjunto voltado para um bem comum. 

Mas ainda assim, o pesquisador/desenvolvedor tem total liberdade para copiar/modificar o código e usar em seus experimentos. Pede-se apenas que além de seguir as regras da Apache License, siga algumas regras de boa conduta e ética comuns em projetos de código livre pelo mundo:

1. O mais importante na licença Apache é o fato de que todo o trabalho realizado a partir deste deve ser aberto e conter a licença Apache, não se esqueça disso.
 
2. Cite o autor, `Raul S. Ferreira` e/ou o `Projeto Myosotis` em seu artigo ou no README.MD do seu trabalho/projeto.
 
3. Notifique o autor sobre o seu trabalho. Ele ficará feliz em saber que outras pessoas estão construindo coisas legais apoiadas por seu trabalho e com certeza mencionará o seu trabalho de volta.

A única coisa que um desenvolvedor de projetos livres ganha em troca de seu trabalho suado é a reputação. Reputação é algo difícil de se conseguir mas fácil de dar. Hoje você ajuda e amanhã com certeza será ajudado.

##Troubleshooting
####Unable to create/open lock file: /data/db/mongod.lock errno:13 Permission denied
First create the directories /data and /data/db

Later, open your terminal and run: `sudo chown -R $USER /data/db`

Ready, verify again running terminal command: mongod

#### Neither Database nor collection has not been created in MongoDB
Try run one crawler by time, running one crawler and commenting other ones.

While you do this, verify you database, running mongo shell, look if now, databases and collections are being created. The reason is that some sites may change its structure and the crawler may become scant.
