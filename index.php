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
        <link href="css/myosotis.css" rel="stylesheet" type="text/css" />
        <!-- Font -->
        <link href="font-awesome-4.2.0/css/font-awesome.min.css" rel="stylesheet">
        <!-- Ionicons -->
        <link href="css/ionicons.min.css" rel="stylesheet" type="text/css" />
        <!-- Leaflet -->
        <link rel="stylesheet" href="css/leaflet.css" />
        <script src="js/leaflet.js"></script>
        <script src="js/leaflet.markercluster-src.js"></script>
    </head>
    <style type="text/css">
    
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
                            <h3>Gênero</h3>
                            <div id="genero" width="250" height="250"></div>
                        </div>

                        <div class="chart tab-pane active" id="sales-chart" style="position: relative; height: 270px;">
                            <h3>Raça</h3>
                            <div id="campus" width="250" height="250"></div>
                        </div>

                        <div class="chart tab-pane active" id="crm-chart" style="position: relative; width: 670px; height: 270px;">
                            <h3>Desaparecido/Estado</h3>
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
                        <p><b style="font-size: 14px;">Você deseja buscar por&hellip;</b></p>
                        <p><b style="font-size: 14px;">Sexo:</b>
                            <input type="radio" name="sexo" value="F">Feminino
                            <input type="radio" name="sexo" value="M">Masculino
                            <input type="radio" name="sexo" value="">Ambos
                        </p>
                        <p><b style="font-size: 14px;">Situação:</b>
                            <input type="radio" name="situacao" value="D">Desaparecidos
                            <input type="radio" name="situacao" value="E">Encontrados
                            <input type="radio" name="situacao" value="">Todos
                        </p>
                        <!-- <p><b style="font-size: 14px;">Faixa Etária:</b>
                            <input type="radio" name="faixa" value="1">Crianças (até 12 anos)
                            <input type="radio" name="faixa" value="2">Adolescentes (13 até 17 anos)
                            <input type="radio" name="faixa" value="3">Adultos (18 até 60 anos)
                            <input type="radio" name="faixa" value="4">Idosos (acima de 60 anos)
                            <input type="radio" name="faixa" value="">Todos
                        </p> -->
                        <p><b style="font-size: 14px;">Cor de pele:</b>
                            <input type="radio" name="raca" value="b">Branca
                            <input type="radio" name="raca" value="pr">Preta
                            <input type="radio" name="raca" value="pa">Parda
                            <input type="radio" name="raca" value="a">Amarela
                            <input type="radio" name="raca" value="i">Indígena
                            <input type="radio" name="raca" value="">Todas
                        </p>
                        <p class="texto"><b style="font-size: 14px;">Nome:</b>
                            <input type="text" name="nome_desaparecido">
                        </p>
                        <p class="texto"><b style="font-size: 14px;">Estado:</b>
                            <input class="cod_estado" type="text" name="cod_estado">
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
        <script type="text/javascript" src="js/jquery-2.0.3.js"></script>
        <script async type="text/javascript" src="js/jquery-ui.min.js"></script>
        <script async type="text/javascript" src="js/bootstrap.min.js"></script>
        <script type="text/javascript" src="js/Chart.js"></script>
        <script type="text/javascript" src="js/estadosNomeados.js"></script>
        <script type="text/javascript" src="js/myosotis.js"></script>
    </body>
</html>
