Projeto-Myosotis
================
[![Build Status](https://travis-ci.org/raulsenaferreira/Projeto-Myosotis.svg)](https://travis-ci.org/raulsenaferreira/Projeto-Myosotis)

Um sistema crawler-based para ajudar na busca de pessoas desaparecidas

##Proposta Inicial

A proposta inicial é coletar informações contidas em sites e blogs de crianças (e pessoas adultas eventualmente) desaparecidas e guardar em um banco de dados. Depois eliminar registros duplicados automaticamente. Em seguida garimpar se os registros estão atualizados, ou seja, se aquela pessoa ainda está desaparecida.

O ideal é que todas as operações(quantidade de registros duplicados, informações desatualizadas) sejam guardadas como um histórico para possíveis análises estatísticas.

Além disso, deve-se explorar as informações geográficas dos registros e a partir dessas informações, conseguir inferir e extrair informações relevantes.

É importante a contrução de uma API que possa fornecer os dados coletados em formato JSON para que outros desenvolvedores possam criar novas ferramentas ou estudos baseados nos dados já coletados por este sistema.

##Issues
https://github.com/raulsenaferreira/Projeto-Myosotis/issues
