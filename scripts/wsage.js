$(function(){    
    //autocomplete de codigo de curso
    preencheCodCurso();
    //Gráficos
});

// Carrega o 1º mapa
function init() {
    
}

// botão de nova busca
function novaBusca(){
    $('#map').html("");
    carregaPontosMapa();
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
    try{
var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
    }),
        latlng = L.latLng(-15.7956343, -58.6324594);//Fazendo o mapa iniciar no Brasil
    mapGlobal = L.map('map', {center: latlng, zoom: 4, layers: [tiles]});
        var tCoordenadas,
            coordenadas;

        tCoordenadas = $("#pontos").val();
        
        if(tCoordenadas != undefined && tCoordenadas != ""){
            coordenadas = JSON.parse(tCoordenadas);
        }
        
        //inserindo pontos no mapa
        if(coordenadas){ 
            
            var markers = L.markerClusterGroup();          
            for (var i = 0; i < coordenadas.length; i++) {
                var a = coordenadas[i];
                var title = a.nome;
                var marker = L.marker(new L.LatLng(a.st_y, a.st_x), { title: title });
                marker.bindPopup(title);
                markers.addLayer(marker);
            }
            mapGlobal.addLayer(markers);
            
            var pdfs = JSON.parse($("#pdfs").val());

            heatMap(pdfs);
        }
    }
    catch(e){
        console.log(e);
    }
}


function heatMap(pdfs){
	pdfs = JSON.parse(pdfs[0].replace(/\'/g, '"'));
    var arrayPDF = {}
	for (x in pdfs) {
        arrayPDF[x] = pdfs[x];
    }
    $.each(statesData.features , function(i){
        nomeEstado = statesData.features[i].properties.Name;
        statesData.features[i].properties.density = arrayPDF[nomeEstado];
        console.log(statesData.features[i].properties.density);
    });    
    
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.density),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
    L.geoJson(statesData, {style: style}).addTo(mapGlobal);
    //grafico
    //drawChart();
}

function getColor(d) {
    return d > 8 ? '#800026' :
           d > 7  ? '#BD0026' :
           d > 6  ? '#E31A1C' :
           d > 5  ? '#FC4E2A' :
           d > 4   ? '#FD8D3C' :
           d > 3   ? '#FEB24C' :
           d > 2   ? '#FED976' :
                      '#FFEDA0';
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