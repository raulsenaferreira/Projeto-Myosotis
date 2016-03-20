Projeto-Myosotis
================
[![Build Status](https://travis-ci.org/raulsenaferreira/Projeto-Myosotis.svg)](https://travis-ci.org/raulsenaferreira/Projeto-Myosotis)
[![Coverage Status](https://coveralls.io/repos/raulsenaferreira/Projeto-Myosotis/badge.svg?branch=master&service=github)](https://coveralls.io/github/raulsenaferreira/Projeto-Myosotis?branch=master)

Um sistema crawler-based baseado em tecnologias NoSQL no auxílio a unificação e estudo dos registros de pessoas desaparecidas.

Uma versão beta do sistema poderá ser acessado no link: http://projeto-myosotis.com.br/


##O Sistema

Este sistema coleta informações contidas em sites de pessoas desaparecidas e guarda em um banco de dados NoSQL, preservando a estrutura heterogênea dos dados. Depois, através de um processo de ETL simples feito em Python, elimina registros duplicados e extrai o máximo de informações do registro. Em seguida, essas informações de diferentes fontes sobre um determinado registro são agregados, unificando assim as informações da pessoa desaparecida e tornando a informação mais completa mantendo as fontes de onde as informações foram extraídas.

Por último, os dados são armazenados de forma estruturada em um banco de dados relacional, para posterior análise espacial e textual. O sistema dispõe também de um webservice, e permite que através de algumas URLs qualquer pessoa ou sistema possa consumir os dados "crawleados".

O sistema permite que se faça alguns tipos de consultas específicas como situação(desaparecido/encontrado), raça(branco, pardo, negro, amarelo e indígena), gênero(masculino e feminino), estado(estados do Brasil) ou nome. Além disso, as consultas são armazenadas em um banco NoSQL chave-valor, funcionando como um cache e deixando as consultas mais rápidas.

Ainda em fase experimental, está a coloração dos estados baseados na probabilidade de ocorrer um novo caso de desaparecimento naquele estado. O cálculo é feito com um método estatístico não paramétrico, conhecido como KDE(https://pt.wikipedia.org/wiki/Estimativa_de_densidade_kernel). Ferramentas de visualização em formato de cluster e polígonos também são utilizados, bem como ferramentas para geração de gráficos.

##Status of crawled sites
http://www.desaparecidos.gov.br [Offline]
http://portal.mj.gov.br [Doesn't exist anymore]
http://www.desaparecidosdobrasil.org [Online]
http://www.desaparecidos.mg.gov.br [Needs adjusts]
http://www.desaparecidos.rs.gov.br [Online]
http://www.biamap.com.br/ [Online]

##Como contribuir
Crie um branch e edite as partes que você julga necessário (P.S.: As issues do projeto são um bom lugar para começar).

Instale opcionalmente as dependências listadas abaixo caso queira visualizar as mudanças.

Envie um pull request para consideração, ele será muito bem vindo!

##Dependências
1. Instale o Postgres (http://www.postgresql.org/) e a extensão PostGIS (http://postgis.net/)
2. Instale o Node.js (https://nodejs.org/en/) e o mongodb (https://www.mongodb.org/) em sua máquina
3. Instale o Redis (http://redis.io/)
4. Instale o módulo pymongo no python (http://api.mongodb.org/python/current/installation.html)
5. Instale o módulo psycopg2 (http://initd.org/psycopg/docs/install.html)
4. Execute o script "INSTALL.sql" contido na pasta raiz deste projeto
5. Altere os arquivos conexao.php e ETL.py adicionando as credenciais de acesso ao banco postgres
5. Certifique-se de colocar o projeto dentro de uma pasta que possa ser lida pelo Apache Web Server. Certifique-se também em ter instalado em sua máquina a versão 2.7.x do Python
6. Inicie o mongodb (mongod)
6. Para executar o crawler, vá na pasta raiz do projeto e digite na linha de comando (node crawler.js) ou caso queira apenas testar com alguns registros digite (node test-crawler.js)
7. Depois de ter crawleado todos os domínios pra dentro do MongoDB, basta entrar na pasta cgi-bin/ e executar o arquivo ETL.py para que seja feito o processo de ETL e gravação dos dados no Postgres
7. Para acessar a aplicação acesse em seu navegador http://localhost/Projeto-Myosotis/
8. Para acessar o webservice, primeiro inicie-o digitando na linha de comando(node API.js) digite http://localhost/Projeto-Myosotis:4000/collections/site1/all (a numeração vai de 1 até 6)

* As informações de latitude e longitude precisarão ser extraídas a partir dos endereços que o crawler conseguiu garimpar e colocar no banco de dados. Para isso você deverá geocodificar os endereços do banco mantendo o id do respectivo registro para posterior update no banco (o script de update está no arquivo INSTALL.sql).

* Para geocodificar você pode usar algumas ferramentas baseadas no batchgeo (https://pt.batchgeo.com/), google maps API (https://developers.google.com/maps/) ou alguma outra ferramenta de geocodificação se sua preferência, lembrando que para localizações no Brasil o formato de SRID deve ser 4674.

##Issues
https://github.com/raulsenaferreira/Projeto-Myosotis/issues

##Troubleshooting
####Unable to create/open lock file: /data/db/mongod.lock errno:13 Permission denied
First create the directories /data and /data/db

Later, open your terminal and run: `sudo chown -R $USER /data/db`

Ready, verify again running terminal command: mongod

#### Neither Database nor collection has not been created in MongoDB
Try run one crawler by time, running one crawler and commenting other ones.

While you do this, verify you database, running mongo shell, look if now, databases and collections are being created. The reason is that some sites may change its structure and the crawler may become scant.
