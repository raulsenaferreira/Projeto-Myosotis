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
    </head>
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
                        <div id="map"></div>
                        <div class="aviosMap">
                            <ul class="listaSemMarcador">
                                <li> Use o botão com a <img src="imagens/hand.png" style="width:15px;height:15px;"> para poder navegar no mapa. </li>
                                <li> Use o botão com o <img src="imagens/polygon.png" style="width:15px;height:15px;"> para conseguir desenhar um polígono no mapa.</li>
                                <li> Use o <i> shift</i> ou um duplo clique do mouse, para poder fechar o polígono.</li>
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
                            <li class="liButtonMap" >
                                <input type="button" class="btn btn-primary mapMenuButton" value="Nova Busca" 
                                       id="reset" onclick="novaBusca();">
                            </li>
                            <li class="liButtonMap" onclick="activePolygonDraw(0);">
                                <div class="btn btn-primary mapMenuButton imagem">
                                    <input type="image" class="btn btn-primary imageButton" 
                                       src="imagens/hand.png" alt="Hand"/>
                                </div>
                            </li>
                            <li class="liButtonMap" onclick="activePolygonDraw(1);">
                                <div class="btn btn-primary mapMenuButton imagem">
                                    <input type="image" class="btn btn-primary imageButton" 
                                       src="imagens/polygon.png" alt="Polygon"/>
                                </div>
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
                    
                    <ul class="nav nav-tabs pull-right">
                        <li>
                            <a href="#revenue-chart">Geral</a>
                        </li>
                        <li>
                            <a href="#sales-chart">Estado</a>
                        </li>
                        <li>
                            <a href="#crm-chart">Gênero</a>
                        </li>
                        <li>
                            <a href="#populacao-chart">Raça</a>
                        </li>
                        <li class="pull-left header"><i class="fa fa-inbox"></i> Gráficos</li>
                        
                    </ul>
                    <div class="tab-content no-padding">
                        
                        <div class="chart tab-pane active" id="revenue-chart" style="position: relative; height: 270px;">
                            <div id="genero" width="250" height="250"></div>
                        </div>

                        <div class="chart tab-pane" id="sales-chart" style="position: relative; height: 270px;">
                            <div id="campus" width="250" height="250"></div>
                        </div>

                        <div class="chart tab-pane" id="crm-chart" style="position: relative; height: 270px;">
                            <div id="crm" width="250" height="250"></div>
                        </div>

                        <div class="chart tab-pane" id="populacao-chart" style="position: relative; height: 270px;">
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
        <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false" style=""></script>
        <script type="text/javascript" src="scripts/OpenLayers.js"></script>
        <script async type="text/javascript" src="scripts/bootstrap.min.js"></script>
        <script type="text/javascript" src="scripts/heatmap.js"></script>
        <script async type="text/javascript" src="scripts/heatmap-gmaps.js"></script>
        <script type="text/javascript" src="scripts/heatmap-openlayers.js"></script>
        <script async type="text/javascript" src="scripts/wsage.js"></script>
        <script type="text/javascript" src="scripts/smoothScroll.js"></script>
        <script type="text/javascript" src="scripts/Chart.js"></script>
        <script src="scripts/AdminLTE/app.js" type="text/javascript"></script>
        <script src="scripts/ol.js" type="text/javascript"></script>
    </body>
</html>