$(function(){
    var map;
    var poligono;
    var vetorCoordenadas;
    var heatmap;
    var controls;
    var mapLayers;
    //autocomplete de codigo de curso
    preencheCodCurso();
    //barra reorganizável
    $(".connectedSortable").sortable({
        placeholder: "sort-highlight",
        connectWith: ".connectedSortable",
        handle: ".box-header, .nav-tabs",
        forcePlaceholderSize: true,
        zIndex: 999999
    }).disableSelection();
    $(".connectedSortable .box-header, .connectedSortable .nav-tabs-custom").css("cursor", "move");

    //Gráficos
    $(".nav-tabs-custom").tabs();
});

// Carrega o 1º mapa
function init() {
    criaMapa();
}

// botão de nova busca
function novaBusca(){
    $('#map').html("");
    criaMapa();
}

//função que percorre os filtros e verifica quais parâmetros estão marcados para ser usado na consulta
function preencheFiltros(){
    var data = { 'filtros' : []};
    $("#filtros input:checked").each(function() {
      data['filtros'].push("&"+$(this).attr('name')+"="+$(this).val());
    });
    
    $("#filtros .texto input").each(function() {
        if ($(this).val()!='') {
            data['filtros'].push("&"+$(this).attr('name')+"="+$(this).val());
        }
    });
    //console.log(data['filtros']);
    return data['filtros'];
}

function preencheCodCurso () {
    $.getJSON('scripts/cod_curso.js', function(data){
        var cod_cursos = [];
         
        $(data).each(function(key, value) {
            cod_cursos.push(value.cod_curso);
        });
         
        $('.cod_curso').autocomplete({ source: cod_cursos, minLength: 1});
    });
}

// envia polígono desenhado por AJAX para a classe de consulta ao BD.
function enviaDados() {
    var situacao = preencheFiltros();
    situacao = situacao.toString();
    situacao = situacao.replace(/,/g,'');

    $('#map').html('');
    preencheCamposCoordenadas();
    var dados = 'poligono='+$('#poligono').val()+
    '&submitted='+$('#submitted').val()+
    situacao; 
    enviaDadosPython(dados);
    $.ajax({                 
        type: 'POST',                                  
        url: 'source.php',                 
        async: true,                 
        data: dados+"&tipoProcessamento=php",                 
        success: function(response) {
            $("#pontos").attr('value',response);
            
            
        }             
    });           
}

function enviaDadosPython(dados){
    
    $.ajax({                 
        type: 'POST',                                  
        url: 'source.php',                 
        async: true,                 
        data: dados+"&tipoProcessamento=python",
        success: function(response) {
            $("#pdfs").attr('value',response);
            
            carregaPontosMapa();
        }             
    });  
}

// Carrega os pontos retornados do banco no 2º mapa
function carregaPontosMapa() {

    var multuPolygonGeometry,
        multiPolygonFeature,
        isPolygon,
        ultimoPoligono,
        coordenadasDesenhadas,
        tCoordenadas,
        coordenadas = "",
        patternPolygon = /POLYGON(?=.)/, 
        polygonList = [],
        pointList = [],
        multipolygon = [],
        poligonoPostGis = $('#poligono').val(),
        source = new Array(), 
        arrayDeCoord = new Array();

    criaMapa();

    tCoordenadas = $("#pontos").val();
    
    if(tCoordenadas != undefined && tCoordenadas != ""){
        coordenadas = JSON.parse(tCoordenadas);
    }

    //inicio redesenho do polígono no 2º mapa
    if(poligonoPostGis!=null && poligonoPostGis!=""){
        try{
            isPolygon = patternPolygon.test(poligonoPostGis);

            if(isPolygon == true){
                //polígono
                poligonoPostGis = poligonoPostGis.replace("POLYGON((","");
                poligonoPostGis = poligonoPostGis.replace(/\)\)/gi,"");
                coordenadasDesenhadas = poligonoPostGis.split(",");

                $.each(coordenadasDesenhadas, function(i){
                    var coord = coordenadasDesenhadas[i].split(" ");
                    source[i] = {x: Number(coord[0]), y: Number(coord[1])};
                });

                arrayDeCoord[0] = source;

                for (var i = arrayDeCoord.length; i--;) {
           
                    for (var j=0; j<arrayDeCoord[i].length; j+=1) {
                        var point = new OpenLayers.Geometry.Point(arrayDeCoord[i][j].x, arrayDeCoord[i][j].y);
                        pointList.push(point);
                    }

                    var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
                    var polygon = new OpenLayers.Geometry.Polygon([linearRing]);

                    polygonList.push(polygon);
                }

                multuPolygonGeometry = new OpenLayers.Geometry.MultiPolygon(polygonList);
                multiPolygonFeature = new OpenLayers.Feature.Vector(multuPolygonGeometry);

                vector.addFeatures(multiPolygonFeature);
            }
            else{
                //multipolígono
                poligonoPostGis = poligonoPostGis.replace(/\(\(/gi,"");
                multipolygon = poligonoPostGis.split(")),");
                ultimoPoligono = multipolygon.length - 1;
                multipolygon[ultimoPoligono] = multipolygon[ultimoPoligono].replace(/\)\)/gi,"");

                $.each(multipolygon, function(k){
                    coordenadasDesenhadas = multipolygon[k].split(",");

                    $.each(coordenadasDesenhadas, function(i){
                        var coord = coordenadasDesenhadas[i].split(" ");
                        source[i] = {x: Number(coord[0]), y: Number(coord[1])};
                    });

                    arrayDeCoord[k] = source;

                    for (var i = arrayDeCoord.length; i--;) {
           
                        for (var j=0; j<arrayDeCoord[i].length; j+=1) {
                            var point = new OpenLayers.Geometry.Point(arrayDeCoord[i][j].x, arrayDeCoord[i][j].y);
                            pointList.push(point);
                        }

                        var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
                        var polygon = new OpenLayers.Geometry.Polygon([linearRing]);

                        polygonList.push(polygon);
                    }

                    multuPolygonGeometry = new OpenLayers.Geometry.MultiPolygon(polygonList);
                    multiPolygonFeature = new OpenLayers.Feature.Vector(multuPolygonGeometry);

                    vector.addFeatures(multiPolygonFeature);
                });
            }
        }catch(e){
            console.log(e);
        } 
    }
    else{
        vector = new OpenLayers.Layer.Vector('Poligono');
    }
    //fim redesenho do polígono no mapa

    //Define 3 cores pra cada regra de cluster
    var colors = {
        low: "rgb(181, 226, 140)",
        middle: "rgb(241, 211, 87)",
        high: "rgb(253, 156, 115)"
    };
    //Define 3 regras de cluster.
    var lowRule = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.LESS_THAN,
            property: "count",
            value: 15
        }),
        symbolizer: {
            fillColor: colors.low,
            fillOpacity: 0.9,
            strokeColor: colors.low,
            strokeOpacity: 0.5,
            strokeWidth: 12,
            pointRadius: 10,
            label: "${count}",
            labelOutlineWidth: 1,
            fontColor: "#ffffff",
            fontOpacity: 0.8,
            fontSize: "12px"
        }
    });
    var middleRule = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.BETWEEN,
            property: "count",
            lowerBoundary: 15,
            upperBoundary: 50
        }),
        symbolizer: {
            fillColor: colors.middle,
            fillOpacity: 0.9,
            strokeColor: colors.middle,
            strokeOpacity: 0.5,
            strokeWidth: 12,
            pointRadius: 15,
            label: "${count}",
            labelOutlineWidth: 1,
            fontColor: "#ffffff",
            fontOpacity: 0.8,
            fontSize: "12px"
        }
    });
    var highRule = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.GREATER_THAN,
            property: "count",
            value: 50
        }),
        symbolizer: {
            fillColor: colors.high,
            fillOpacity: 0.9,
            strokeColor: colors.high,
            strokeOpacity: 0.5,
            strokeWidth: 12,
            pointRadius: 20,
            label: "${count}",
            labelOutlineWidth: 1,
            fontColor: "#ffffff",
            fontOpacity: 0.8,
            fontSize: "12px"
        }
    });
    //Cria estilo para as 3 regras criadas
    var style = new OpenLayers.Style(null, {
        rules: [lowRule, middleRule, highRule]
    });

    var vector2 = new OpenLayers.Layer.Vector("Pontos", {
        renderers: ['Canvas','SVG'],
        strategies: [
            new OpenLayers.Strategy.AnimatedCluster({
                distance: 45,
                animationMethod: OpenLayers.Easing.Expo.easeOut,
                animationDuration: 20
            })
        ],
        styleMap: new OpenLayers.StyleMap(style)
    });

    //inserindo pontos no mapa
    var features = []

    if(coordenadas[0]){
        $.each(coordenadas , function(i){
            //atributos JSON
            latitude = coordenadas[i].st_y;
            longitude = coordenadas[i].st_x;

            var lonlat=new OpenLayers.LonLat(longitude, latitude).transform('EPSG:4326', 'EPSG:3857')
            var f = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat));
            features.push(f);          
        });
        
        var pdfs = JSON.parse($("#pdfs").val());
        heatMap(coordenadas, pdfs);
    }

    mapLayers[mapLayers.length] = vector;
    mapLayers[mapLayers.length]=vector2;
    map.addLayers(mapLayers);
    vector2.addFeatures(features);
}

// Funcao para ativar e desativar o poligono.
function activePolygonDraw(active) {
    if(active == 0){
        poligono.deactivate();
    }else{
        poligono.activate();
    }
} 

function criaMapa(){
    //Requisitando o openlayers para criar um mapa.
    map = new OpenLayers.Map('map')
    vector = new OpenLayers.Layer.Vector('Poligono');
    //Definindo os mapas que serão exibidos.
    mapLayers=[
        new OpenLayers.Layer.Google(
            "Google Hybrid",
            {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
        ),
        vector
    ];

    map.addLayers(mapLayers);
    
    //Adicionando os controles, vai permitir desenhar o poligono.
    poligono = new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Polygon); 
    map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.addControl(new OpenLayers.Control.MousePosition()); 
    map.addControl(poligono);


    //Fazendo o mapa iniciar no Brasil
    var lonlat = new OpenLayers.LonLat(-58.6324594,-15.7956343).transform('EPSG:4326', 'EPSG:3857');
    map.setCenter(lonlat, 4); 
}

// captura região desenhada e converte em Polygon ou Multipolygon
function preencheCamposCoordenadas(){
    try{
        var coordenadaPoligono = "";
            

        if(vector.features[0] != undefined){
        	var tamPolygon = vector.features.length;
        	
        	if(tamPolygon > 1){
		        var multipolygon = "";

		        for(var i = 0; i < tamPolygon; i++){
		            coordenadaPoligono = vector.features[i].geometry + "";
		            multipolygon += coordenadaPoligono;
		        }

		        multipolygon = multipolygon.replace(/polygon/gi, ",");
		        multipolygon = multipolygon.replace(",","");
		        multipolygon = "MULTIPOLYGON("+multipolygon+")";
		        multipolygon.split("{",1);
		        $('#poligono').val(multipolygon);
		    }
		    else{
		        coordenadaPoligono = vector.features[0].geometry + "";
		        coordenadaPoligono.split("{",1);
		        $('#poligono').val(coordenadaPoligono);
		    }
        }
    } catch(e){
        console.log(e);
    }   
}

function heatMap(coordenadas, pdfs){ 
    var arrayData = [];
	var arrayPDF = JSON.parse(pdfs);
	
    $.each(coordenadas , function(i){
        arrayData[i] = {lat: coordenadas[i].st_y,  lng: coordenadas[i].st_x, count: arrayPDF[i]};
    });    
    
    var testData={
        max: 35,
        data: arrayData
    };

    var transformedTestData = { max: testData.max , data: [] },
        data = testData.data,
        datalen = data.length,
        nudata = [];
 
    while(datalen--){
        nudata.push({
            lonlat: new OpenLayers.LonLat(data[datalen].lng, data[datalen].lat),
            count: data[datalen].count
        });
    }

    transformedTestData.data = nudata;

    var layer = new OpenLayers.Layer.Google(
            "Google Streets", 
            {numZoomLevels: 20}
        )
    
    var heatmap = new OpenLayers.Layer.Heatmap( "Heatmap Layer", map, layer, {visible: true, radius:20}, {isBaseLayer: false, opacity: 100, projection: new OpenLayers.Projection("EPSG:4326")});
    
    mapLayers[mapLayers.length] = layer;
    mapLayers[mapLayers.length] = heatmap;

    heatmap.setDataSet(transformedTestData);

    //grafico
    drawChart();
}

//grafico
function drawChart(){
    var mapCrm={};
    var crm=0.0;
    var masculino = 1;
    var feminino = 1;
    var seropedica = 0;
    var ni = 0;
    var tr = 0;
    var crmMasculino = 0.0;
    var crmFeminino = 0.0;

    var coordenadas = "";
    var tCoordenadas = $("#pontos").val();
    
    if(tCoordenadas != undefined && tCoordenadas != ""){
        coordenadas = JSON.parse(tCoordenadas);
    }
    if(coordenadas[0] && coordenadas!=null){
        
        $.each(coordenadas , function(i){

            if (coordenadas[i].sexo=="M" && (coordenadas[i].cra!="" && coordenadas[i].cra!=null)) {
                crmMasculino+=parseFloat(coordenadas[i].cra);
                masculino++;
            }
            else if (coordenadas[i].sexo=="F" && (coordenadas[i].cra!="" && coordenadas[i].cra!=null)) {
                crmFeminino+=parseFloat(coordenadas[i].cra);
                feminino++;
            }
            if (coordenadas[i].campus=="Seropédica") {
                seropedica++;
            }
            else if (coordenadas[i].campus=="Nova Iguaçu") {
                ni++;
            }
            else if (coordenadas[i].campus=="Três Rios") {
                tr++;
            }
            //pegar CR médio de forma genérica independente da consulta
            mapCrm[coordenadas[i].campus]=coordenadas[i].crm;
        });
    }
    coordenadas="";

    // For a pie chart
    var genero = [
        {
            value: masculino,
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Masculino"
        },
        {
            value: feminino,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Feminino"
        }
    ]

    var html='<canvas id="graficoGenero" width="250" height="250"></canvas>';
     $("#genero").html(html);               
    var ctx = $("#graficoGenero").get(0).getContext("2d");
    var myPieChart = new Chart(ctx).Pie(genero);
    
    // Doughnut
    var campus = [
        {
            value: seropedica,
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Seropédica"
        },
        {
            value: ni,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Nova Iguaçu"
        },
        {
            value: tr,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Três Rios"
        }
    ]
    
    var html='<canvas id="graficoCampus" width="250" height="250"></canvas>';
     $("#campus").html(html);               
    // For a pie chart
    var ctx = $("#graficoCampus").get(0).getContext("2d");
    var myPieChart = new Chart(ctx).Doughnut(campus);

    //Polar
    //var myPieChart = new Chart(ctx).PolarArea(coordenadas);
    //Radar
    //var myPieChart = new Chart(ctx).Radar(data);
    
    //Bar
    var count=0.0;
    for(indice in mapCrm){
        crm+=parseFloat(mapCrm[indice]);
        count++;
    }
    crm /= count;
    
    crmMasculino = crmMasculino/masculino;
    crmFeminino = crmFeminino/feminino;
    
    var crMedio = {
        labels: ["Geral", "Masculino", "Feminino"],
        datasets: [
            {
                label: "CRM",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [crm.toFixed(2), crmMasculino.toFixed(2), crmFeminino.toFixed(2)]
            }
        ]
    };
    var html='<canvas id="graficoCrm" width="250" height="250"></canvas>';
     $("#crm").html(html);

    //pie chart
    var ctx = $("#graficoCrm").get(0).getContext("2d");
    var myPieChart = new Chart(ctx).Bar(crMedio);
}