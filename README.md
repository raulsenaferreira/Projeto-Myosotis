Projeto-Myosotis
================
[![Build Status](https://travis-ci.org/raulsenaferreira/Projeto-Myosotis.svg)](https://travis-ci.org/raulsenaferreira/Projeto-Myosotis)

Um sistema crawler-based para ajudar na busca de pessoas desaparecidas

##Proposta Inicial

A proposta inicial é coletar informações contidas em sites e blogs de crianças e pessoas adultas desaparecidas e guardar em um banco de dados. Depois eliminar registros duplicados automaticamente. Em seguida garimpar se os registros estão atualizados, ou seja, se aquela pessoa ainda está desaparecida. E por último, agregar as informações da pessoa desaparecida espalhada em diferentes sites em um registro só, tornando-o mais completo e embasado por diferentes fontes.

O ideal é que todas as operações(quantidade de registros duplicados, informações desatualizadas) sejam guardadas como um histórico para possíveis análises estatísticas.

Além disso, deve-se explorar as informações geográficas dos registros e a partir dessas informações, conseguir inferir e extrair informações relevantes.

É importante a contrução de uma API que possa fornecer os dados coletados em formato JSON para que outros desenvolvedores possam criar novas ferramentas ou estudos baseados nos dados já coletados por este sistema.

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
**OBS: As informações de latitude e longitude precisarão ser extraídas a partir dos endereços que o crawler conseguiu garimpar e colocar no banco de dados. Para isso você deverá geocodificar os endereços do banco mantendo o id do respectivo registro para posterior update no banco (o script de update está no arquivo INSTALL.sql).

Para geocodificar você pode usar algumas ferramentas baseadas no batchgeo (), google maps API () ou alguma outra ferramenta de geocodificação se sua preferência, lembrando que para localizações no Brasil o formato de SRID deve ser 4764.**

##Issues
https://github.com/raulsenaferreira/Projeto-Myosotis/issues
