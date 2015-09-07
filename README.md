Projeto-Myosotis
================
[![Build Status](https://travis-ci.org/raulsenaferreira/Projeto-Myosotis.svg)](https://travis-ci.org/raulsenaferreira/Projeto-Myosotis)

Um sistema crawler-based para ajudar na busca de pessoas desaparecidas

##O Sistema

Este sistema coleta informações contidas em sites de pessoas desaparecidas e guarda em um banco de dados NoSQL, preservando a estrutura heterogênea dos dados. Depois, através de um processo de ETL simples feito em Python, elimina registros duplicados e extrai o máximo de informações do registro. Em seguida, essas informações de diferentes fontes sobre um determinado registro são agregados, unificando assim as informações da pessoa desaparecida e tornando a informação mais completa mantendo as fontes de onde as informações foram extraídas.

Por último, os dados são armazenados de forma estruturada em um banco de dados relacional, para posterior análise espacial e textual. O sistema dispõe também de um webservice, e permite que através de algumas URLs qualquer pessoa ou sistema possa consumir os dados "crawleados".

O sistema permite que se faça alguns tipos de consultas específicas como situação(desaparecido/encontrado), raça(branco, pardo, negro, amarelo e indígena), gênero(masculino e feminino), estado(estados do Brasil) ou nome. Além disso, as consultas são armazenadas em um banco NoSQL chave-valor, funcionando como um cache e deixando as consultas mais rápidas. 

Ainda em fase experimental, está a coloração dos estados baseados na probabilidade de ocorrer um novo caso de desaparecimento naquele estado. O cálculo é feito com um método estatístico não paramétrico, conhecido como KDE(https://pt.wikipedia.org/wiki/Estimativa_de_densidade_kernel). Ferramentas de visualização em formato de cluster e polígonos também são utilizados, bem como ferramentas para geração de gráficos.

##Como contribuir
Dê um Fork e edite as partes que você julga necessário (P.S.: As issues do projeto são um bom lugar para começar).

Instale opcionalmente as dependências listadas abaixo caso queira visualizar as mudanças.

Envie um pull request para consideração, ele será muito bem vindo!

##Dependências
1. Instale o Postgres (http://www.postgresql.org/) e a extensão PostGIS (http://postgis.net/)
2. Instale o Node.js (https://nodejs.org/en/) e o mongodb (https://www.mongodb.org/) em sua máquina
3. Instale o Redis (http://redis.io/)
4. Execute o script "INSTALL.sql" contido na pasta raiz deste projeto
5. Certifique-se de colocar o projeto dentro de uma pasta que possa ser lida pelo Apache Web Server. Certifique-se também em ter instalado em sua máquina a versão 2.7.x do Python
6. Para executar o crawler, primeiro inicie o mongodb, em seguida vá na pasta raiz do projeto e digite na linha de comando (node crawler.js) ou caso queira apenas testar com alguns registros digite (node test-crawler.js)

* As informações de latitude e longitude precisarão ser extraídas a partir dos endereços que o crawler conseguiu garimpar e colocar no banco de dados. Para isso você deverá geocodificar os endereços do banco mantendo o id do respectivo registro para posterior update no banco (o script de update está no arquivo INSTALL.sql).

* Para geocodificar você pode usar algumas ferramentas baseadas no batchgeo (), google maps API () ou alguma outra ferramenta de geocodificação se sua preferência, lembrando que para localizações no Brasil o formato de SRID deve ser 4764.

##Issues
https://github.com/raulsenaferreira/Projeto-Myosotis/issues
