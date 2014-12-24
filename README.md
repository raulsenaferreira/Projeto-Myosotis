Projeto-Myosotis
================
[![Build Status](https://travis-ci.org/raulsenaferreira/Projeto-Myosotis.svg)](https://travis-ci.org/raulsenaferreira/Projeto-Myosotis)
Um sistema crawler-based para ajudar na busca de pessoas desaparecidas

Proposta Inicial
==
A proposta inicial é coletar informações contidas em sites e blogs de crianças (e pessoas adultas eventualmente) desaparecidas e guardar em um banco de dados. Depois eliminar registros duplicados automaticamente. Em seguida garimpar se os registros estão atualizados, ou seja, se aquela pessoa ainda está desaparecida.

O ideal é que todas as operações(quantidade de registros duplicados, informações desatualizadas) sejam guardadas como um histórico para possíveis análises estatísticas.

Implementado até o momento
==
Crawler parcialmente paralelizado e registros salvos no MongoDB.

Erros
==
Alguns sites travam a busca da informação depois de alguns requests, provocando travamento da ferramenta e posterior desconexão, o que causa interrupção precoce do crawler. Isso faz com que a ferramenta ainda não esteja pegando o máximo de registros que ele poderia pegar.
