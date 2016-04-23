$(function(){
    var geojson;
    //autocomplete de codigo de curso
    var estados = [];
    preencheCodCurso(estados);
});


function init() {
    var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
    }),
        latlng = L.latLng(-15.7956343, -58.6324594);//Fazendo o mapa iniciar no Brasil

    mapGlobal = L.map('map', {center: latlng, zoom: 4, layers: [tiles]});
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

function preencheCodCurso (estados) {
    $.getJSON('js/estadosCombobox.js', function(data){
        $(data).each(function(key, value) {
            estados.push(value.estado);
        });

        $('.cod_estado').autocomplete({ source: estados, minLength: 1});
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
        $('#map_container').html('');
        $('#map_container').html('<div id="map"></div>');

        init();

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
                var idade = a.idade;
                var dataDesaparecimento = a.data_desaparecimento;
                var marker = L.marker(new L.LatLng(a.st_y, a.st_x), { title: title });

                var popup = '<b style="text-transform: capitalize;">'+title+'</b><br>';
                popup+='Idade: '+idade+'<br>';
                popup+='Desaparecido desde: '+dataDesaparecimento+'<br>';
                popup+='<a href="registroAgregado.php?nome='+title+'" target="_blank">Clique aqui para mais detalhes.</a>';
                marker.bindPopup(popup);
                markers.addLayer(marker);
            }
            mapGlobal.addLayer(markers);

            //Adiciona uma caixa de controle
            // var clusterControl = {"Pontos": markers}
            // L.control.layers(clusterControl).addTo(mapGlobal);

            //Coloração dos estados
            heatMap(JSON.parse($("#pdfs").val()));
        }
    }
    catch(e){
        console.log(e);
    }
}


function heatMap(pdfs){
	pdfs = JSON.parse(pdfs[0].replace(/\'/g, '"'));
  var arrayPDF = {};
	for (x in pdfs) {
        arrayPDF[x] = pdfs[x];
    }
    $.each(statesData.features , function(i){
        nomeEstado = statesData.features[i].properties.Name;
        statesData.features[i].properties.density = arrayPDF[nomeEstado];
        //console.log(statesData.features[i].properties.density);
    });

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.density),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.6
        };
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    var info = L.control();

    info.onAdd = function (mapGlobal) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>PDF por Estado</h4>' +  (props ?
            '<b>' + props.Name + '</b><br />' + props.density + '.'
            : 'Passe o mouse sobre um estado');
    };

    info.addTo(mapGlobal);

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
        info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
        mapGlobal.fitBounds(e.target.getBounds());
    }

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 2, 3, 4, 5, 6, 7, 8],
            labels = [];

        div.innerHTML += '<h5>*Probabilidade de<br>novas ocorrências</h5>';
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(mapGlobal);

    geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(mapGlobal);


    //grafico
    drawChart();
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
    var masculino = 1;
    var feminino = 1;
    var coordenadas = "";
    var tCoordenadas = $("#pontos").val();
    var corDaPele={'Branca':0, 'Preta':0, 'Amarela':0, 'Parda':0, 'Indigena':0};
    var estados={'AC':0, 'AL':0, 'AP':0, 'AM':0, 'BA':0, 'CE':0, 'DF':0, 'ES':0, 'GO':0,
        'MA':0, 'MT':0, 'MS':0, 'MG':0, 'PA':0, 'PB':0, 'PR':0, 'PE':0, 'PI':0,
        'RJ':0, 'RN':0, 'RS':0, 'RO':0, 'RR':0, 'SC':0, 'SP':0, 'SE':0, 'TO':0};

    if(tCoordenadas != undefined && tCoordenadas != ""){
        coordenadas = JSON.parse(tCoordenadas);
    }
    if(coordenadas[0] && coordenadas!=null){

        $.each(coordenadas , function(i){

            if (coordenadas[i].sexo=="M") masculino++;
            else if (coordenadas[i].sexo=="F") feminino++;

            var etnia = coordenadas[i].cor_da_pele.toLowerCase();
            if (etnia=="branca" || etnia=="branco") corDaPele['Branca']++;
            else if (etnia=="negra" || etnia=="negro" || etnia=="morena escura" || etnia=="moreno escuro" || etnia=="mulato" || etnia=="mulata") corDaPele['Preta']++;
            else if (etnia=="amarela" || etnia=="amarelo") corDaPele['Amarela']++;
            else if (etnia=="parda" || etnia=="pardo" || etnia=="moreno" || etnia=="morena" || etnia=="moreno claro" || etnia=="morena clara") corDaPele['Parda']++;
            else if (etnia=="indigena" || etnia=="indígena") corDaPele['Indigena']++;

            var uf = coordenadas[i].uf_desaparecimento;
            estados[uf]++;
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
    var raca = [
        {
            value: corDaPele['Branca'],
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Branca"
        },
        {
            value: corDaPele['Preta'],
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Preta"
        },
        {
            value: corDaPele['Parda'],
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Parda"
        },
        {
            value: corDaPele['Amarela'],
            color: "#FDB00C",
            highlight: "#FFC000",
            label: "Amarela"
        },
        {
            value: corDaPele['Indigena'],
            color: "#FDCDDC",
            highlight: "#FFCDD0",
            label: "Indígena"
        }
    ]

    var html='<canvas id="graficoCampus" width="250" height="250"></canvas>';
     $("#campus").html(html);
    // For a pie chart
    var ctx = $("#graficoCampus").get(0).getContext("2d");
    var myPieChart = new Chart(ctx).Doughnut(raca);

    //Polar
    //var myPieChart = new Chart(ctx).PolarArea(coordenadas);
    //Radar
    //var myPieChart = new Chart(ctx).Radar(data);

    //Bar
    var i=0;
    arrayEstado=[];

    for (x in estados) {
        arrayEstado[i] = estados[x];
        i++;
    }
    //console.log(arrayEstado[18]);
    var estadoBar = {
        labels: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
        'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
        'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'],
        datasets: [
            {
                label: "Registros/Estados",
                fillColor: "rgba(174,58,227,0.5)",
                strokeColor: "rgba(174,58,227,0.8)",
                highlightFill: "rgba(174,58,227,0.75)",
                highlightStroke: "rgba(174,58,227,1)",
                data: [estados['AC'], estados['AL'], estados['AP'], estados['AM'], estados['BA'], estados['CE'], estados['DF'],
                estados['ES'], estados['GO'], estados['MA'], estados['MT'], estados['MS'], estados['MG'], estados['PA'],
                estados['PB'], estados['PR'], estados['PE'], estados['PI'], estados['RJ'], estados['RN'], estados['RS'],
                estados['RO'], estados['RR'], estados['SC'], estados['SP'], estados['SE'], estados['TO']]
            }
        ]
    };
    var html='<canvas id="graficoCrm" width="650" height="250"></canvas>';
     $("#crm").html(html);

    //pie chart
    var ctx = $("#graficoCrm").get(0).getContext("2d");
    var myPieChart = new Chart(ctx).Bar(estadoBar);
}
