<!DOCTYPE html>
<html>
    <head>
        <title>Projeto Myosotis | Dashboard</title>

        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="author" content="Raul Sena Ferreira">
        <!-- Stylesheets -->
        <link href="css/default.css" rel="stylesheet" type="text/css" />
        <link href="css/style.css" rel="stylesheet" type="text/css" />
        <link href="css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="css/jquery-ui.min.css" rel="stylesheet" type="text/css" />
        <link href="css/AdminLTE.css" rel="stylesheet" type="text/css" />
        <link href="css/wsage.css" rel="stylesheet" type="text/css" />
        <!-- Font -->
        <link href="font-awesome-4.2.0/css/font-awesome.min.css" rel="stylesheet">
        <!-- Ionicons -->
        <link href="css/ionicons.min.css" rel="stylesheet" type="text/css" />
        <!-- Leaflet -->
        <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.css" />
        <script src="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js"></script>
        <script src="scripts/leaflet.markercluster-src.js"></script>
    </head>
    <style type="text/css">
    .marker-cluster-small {
        background-color: rgba(181, 226, 140, 0.6);
        }
    .marker-cluster-small div {
        background-color: rgba(110, 204, 57, 0.6);
        }

    .marker-cluster-medium {
        background-color: rgba(241, 211, 87, 0.6);
        }
    .marker-cluster-medium div {
        background-color: rgba(240, 194, 12, 0.6);
        }

    .marker-cluster-large {
        background-color: rgba(253, 156, 115, 0.6);
        }
    .marker-cluster-large div {
        background-color: rgba(241, 128, 23, 0.6);
        }

        /* IE 6-8 fallback colors */
    .leaflet-oldie .marker-cluster-small {
        background-color: rgb(181, 226, 140);
        }
    .leaflet-oldie .marker-cluster-small div {
        background-color: rgb(110, 204, 57);
        }

    .leaflet-oldie .marker-cluster-medium {
        background-color: rgb(241, 211, 87);
        }
    .leaflet-oldie .marker-cluster-medium div {
        background-color: rgb(240, 194, 12);
        }

    .leaflet-oldie .marker-cluster-large {
        background-color: rgb(253, 156, 115);
        }
    .leaflet-oldie .marker-cluster-large div {
        background-color: rgb(241, 128, 23);
    }

    .marker-cluster {
        background-clip: padding-box;
        border-radius: 20px;
        }
    .marker-cluster div {
        width: 30px;
        height: 30px;
        margin-left: 5px;
        margin-top: 5px;

        text-align: center;
        border-radius: 15px;
        font: 12px "Helvetica Neue", Arial, Helvetica, sans-serif;
        }
    .marker-cluster span {
        line-height: 30px;
        }
        .leaflet-cluster-anim .leaflet-marker-icon, .leaflet-cluster-anim .leaflet-marker-shadow {
            -webkit-transition: -webkit-transform 0.3s ease-out, opacity 0.3s ease-in;
            -moz-transition: -moz-transform 0.3s ease-out, opacity 0.3s ease-in;
            -o-transition: -o-transform 0.3s ease-out, opacity 0.3s ease-in;
            transition: transform 0.3s ease-out, opacity 0.3s ease-in;
        }
    .leaflet-popup-content{
        color: #000000;
    }
    .info {
        padding: 6px 8px;
        font: 14px/16px Arial, Helvetica, sans-serif;
        background: white;
        background: rgba(255,255,255,0.8);
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
        border-radius: 5px;
        color: #000000;
    }
    .info h4 {
        margin: 0 0 5px;
        color: #777;
    }
    .legend {
        line-height: 18px;
        color: #555;
    }
    .legend i {
        width: 18px;
        height: 18px;
        float: left;
        margin-right: 8px;
        opacity: 0.7;
    }
    .chart.tab-pane.active{
        float: left;
        margin-left: 25px;
    }
    </style>
    <body onload="init()" role="document" class="skin-blue">
        <!-- Main content -->
        <section class="content">
            <!-- Main row -->
            <div class="row">
                <!-- Map box -->
                <div class="box box-solid bg-light-blue-gradient">
                    <div class="box-header">
                        <!-- tools box -->
                        <div class="pull-right box-tools">
                            <button class="btn btn-primary btn-sm daterange pull-right" data-toggle="tooltip" title="Date range"><i class="fa fa-calendar"></i></button>
                            <button class="btn btn-primary btn-sm pull-right" data-widget='collapse' data-toggle="tooltip" title="Collapse" style="margin-right: 5px;"><i class="fa fa-minus"></i></button>
                        </div><!-- /. tools -->

                        <i class="fa fa-map-marker"></i>
                        <h3 class="box-title">
                            Mapa
                        </h3>
                    </div>
                    <div class="box-body">
                        <div id="map_container">
                            <div id="map"></div>
                        </div>
                        
                        <div class="avisoMap">
                            <ul class="listaSemMarcador">
                                <li> Clique no botão "Buscar" e monte a sua consulta, caso você não selecione nenhuma opção a consulta trará todos os resultados. </li>
                                <li> Clique nos <i>clusters</i> (grupos no mapa) para detalhar melhor os pontos. Clique nos pontos para mostrar as informações da pessoa desaparecida. </li>
                                <li> *A probabilidade de cada estado foi calculada usando-se o método KDE (Kernel Density Estimation) em cima dos registros fornecidos pelos sites de buscas de pessoas desaparecidas. <a href="#">Clique aqui</a> para maiores detalhes. </li>
                                <li> **Este site não se responsabiliza por informações erradas, e nem afirma que os dados aqui apresentados são mais confiáveis do que os da polícia civil ou departamentos afins. Apenas centralizamos as informações de várias fontes confiáveis e disponibilizamos de uma maneira geograficamente organizada. <a href="#">Clique aqui</a> para maiores detalhes.</li>
                            </ul>
                        </div>
                    </div><!-- /.box-body-->
                    <div class="box-footer no-border">
                        <!-- botões de busca -->
                        <ul id="mapMenu" class="listaSemMarcador">
                            <li class="liButtonMap"> 
                                <input type="button" class="btn btn-primary mapMenuButton imagem" value="Buscar" 
                                       id="enviar" data-toggle="modal" data-target="#myModal"> 
                            </li>
                            <li class="liButtonMap"> 
                                <input type="button" class="btn btn-primary mapMenuButton" value="Salvar Consulta" 
                                       id="save" data-toggle="modal" data-target="#modalSave" onclick="salvarConsulta();"> 
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- /.box -->
                <div class="nav-tabs-custom">
                    <!-- Tabs within a box -->
                    
                    <h3 class="graficoTitulo">Gráficos</h3>
                    <div class="tab-content no-padding">
                        
                        <div class="chart tab-pane active" id="revenue-chart" style="position: relative; width: 270px; height: 270px;">
                            <div id="genero" width="250" height="250"></div>
                        </div>

                        <div class="chart tab-pane active" id="sales-chart" style="position: relative; height: 270px;">
                            <div id="campus" width="250" height="250"></div>
                        </div>

                        <div class="chart tab-pane active" id="crm-chart" style="position: relative; width: 670px; height: 270px;">
                            <div id="crm" width="650" height="250"></div>
                        </div>

                        <div class="chart tab-pane active" id="populacao-chart" style="position: relative; height: 270px;">
                            <div id="populacao" width="250" height="250"></div>
                        </div>

                    </div>
                </div><!-- /.nav-tabs-custom -->
            </div><!-- /.row (main row) -->
        </section><!-- /.content -->
        <!-- guarda informaçoes dos pontos -->
        <input id="pontos">
        <input id="pdfs">
        <!-- envio de dados para o banco -->
        <form id="consultarPoligono" method="post" name="consultarPoligono"  action="">
            <input id="poligono" type="hidden" name="poligono">
            <input type="hidden" name="submitted" id="submitted" value="true" />
            <div id="filtros">
                <!-- MODAL -->
                <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <h4 class="modal-title">Escolha o filtro de busca</h4>
                      </div>
                      <div class="modal-body">
                        <p>Você deseja buscar por&hellip;</p>
                        <p>Sexo:
                            <input type="radio" name="sexo" value="F">Feminino
                            <input type="radio" name="sexo" value="M">Masculino
                            <input type="radio" name="sexo" value="">Ambos
                        </p>
                        <p>Situação:
                            <input type="radio" name="situacao" value="1">Ativo
                            <input type="radio" name="situacao" value="1">Inativo
                            <input type="radio" name="situacao" value="6">Formado
                        </p>
                        <p>Campus:
                            <input type="radio" name="campus" value="Seropédica">Seropédica
                            <input type="radio" name="campus" value="Nova Iguaçu">Nova Iguaçu
                            <input type="radio" name="campus" value="Três Rios">Três Rios
                            <input type="radio" name="campus" value="">Todos
                        </p>
                        <p class="texto">CR Acumulado acima de:
                            <input type="text" name="cra_aluno">
                        </p>
                        <p class="texto">Nome do Curso:
                            <input class="cod_curso" type="text" name="cod_curso">
                        </p>
                        <p class="texto">Naturalidade:
                            <input class="naturalidade" type="text" name="naturalidade">
                        </p>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="enviaDados();">Buscar</button>
                      </div>
                    </div><!-- /.modal-content -->
                  </div><!-- /.modal-dialog -->
                </div><!-- /.modal -->
                </div>
        </form> 
        <!-- scripts -->
        <script type="text/javascript" src="scripts/jquery-2.0.3.js"></script>
        <script async type="text/javascript" src="scripts/jquery-ui.min.js"></script>
        <script async type="text/javascript" src="scripts/bootstrap.min.js"></script>
        <script type="text/javascript" src="scripts/smoothScroll.js"></script>
        <script type="text/javascript" src="scripts/Chart.js"></script>
        <script type="text/javascript" src="scripts/estadosNomeados.js"></script>
        <script type="text/javascript" src="scripts/wsage.js"></script>
    </body>
</html>
