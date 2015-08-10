var request = require('request')
  , cheerio = require('cheerio')
  , async = require('async')
  , format = require('util').format
  , Parse = require('node-parse-api').Parse
  , mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
  // Create your schemas and models here.
  
});
var desaparecido = new mongoose.Schema({
    nome: { type: String }
  , img: String
  , status: {type: String, default: "Desaparecido(a)"}
  , dataDesaparecimento: String
  , dataDoRegistro: String
  , local: String
  , motivacao: String
  , boletimOcorrencia: String
  , sexo: String
  , corDaPele: String
  , idadeDesaparecimento: String
  , pesoAproximado: String
  , idadeHoje: String
  , alturaAproximada: String
  , transtornoMental: String
  , olhos: String
  , cabelo: String
  , raca: String
  , tipoFisico: String
  , observacao: String
  , dataLocalizacao: String
  , circunstanciasLocalizacao: String
  , ufLocalizacao: String
  , ultimaInformacao: String
  , fonte: String
  , atualizado_em: { type: Date, default: Date.now }
  });

var Desaparecido = mongoose.model('Desaparecido', desaparecido);
mongoose.connect('mongodb://localhost/myosotis');

// preparing limits of crawling
var arrCrawler1=[], arrCrawler2=[], arrCrawler3=[];
arrCrawler1 = generateArray(3018, 3019, arrCrawler1);
arrCrawler2 = generateArray(2510, 2512, arrCrawler2);
arrCrawler3 = generateArray(8, 12, arrCrawler3);

crawler1(arrCrawler1);
crawler2(arrCrawler2);
//crawler3();

function generateArray(ini, end, arr) {
  while (ini<=end) { arr.push(ini); ini++; }
  return arr;
}

//http://www.desaparecidos.gov.br
function crawler1 (limite) {
  console.dir("Iniciando crawler do primeiro site...");
  var casos=0;
  //var limite = [3010, 3011, 3012]; // 3020
  
  async.each(limite, function (id, callback) { 
    
    var urlSegundoNivel = format('http://www.desaparecidos.gov.br/desaparecidos/application/modulo/detalhes.php?id=%s', id);
    
    request(urlSegundoNivel, function (err, response, body) {
      if (err) throw err;
      var $ = cheerio.load(body);

      var nome = $('.titulo').text().trim();
      
      //Só prossegue se tiver pelo menos um nome
      if(nome!='' && nome!=undefined){
        var img = $('img').attr('src');
        var status = $('.desaparecido').text().trim();

        if (status=='' || status==undefined) {
          status = $('.encontrado').text().trim();
        }
        
        var dataLocal = $('.inf p:nth-child(1)').text().trim();
        dataLocal = dataLocal.split("no município de");
        var dataDesaparecimento = dataLocal[0];
        var local = dataLocal[1];
        var motivacao = $('.inf p:nth-child(2)').text().trim();
        var boletimOcorrencia = $('.inf p:nth-child(3)').text().trim();
        var sexo = $('table tr:nth-child(1) td:nth-child(1)').text().trim();
        var corDaPele = $('table tr:nth-child(1) td:nth-child(2)').text().trim();
        var idadeDesaparecimento = $('table tr:nth-child(2) td:nth-child(1)').text().trim();
        var pesoAproximado = $('table tr:nth-child(2) td:nth-child(2)').text().trim();
        var idadeHoje = $('table tr:nth-child(3) td:nth-child(1)').text().trim();
        var alturaAproximada = $('table tr:nth-child(3) td:nth-child(2)').text().trim();
        var transtornoMental = $('table tr:nth-child(4) td:nth-child(1)').text().trim();
        var olhos = $('table tr:nth-child(4) td:nth-child(2)').text().trim();
        var tipoFisico = $('table tr:nth-child(5) td:nth-child(1)').text().trim();
        var cabelos = $('table tr:nth-child(5) td:nth-child(2)').text().trim();
        var ultimaInformacao = $('.inf p:nth-child(6)').text().trim();


        var registro = new Desaparecido({
            nome: nome
          , img: img
          , status: status
          , dataDesaparecimento: dataDesaparecimento
          , local: local
          , fonte: 'http://www.desaparecidos.gov.br/desaparecidos/application/modulo/detalhes.php?id='+id
          , motivacao: motivacao
          , boletimOcorrencia: boletimOcorrencia
          , sexo: sexo
          , corDaPele: corDaPele
          , idadeDesaparecimento: idadeDesaparecimento
          , pesoAproximado: pesoAproximado
          , idadeHoje: idadeHoje
          , alturaAproximada: alturaAproximada
          , transtornoMental: transtornoMental
          , olhos: olhos
          , tipoFisico: tipoFisico
          , ultimaInformacao: ultimaInformacao
        });

        registro.save(function(err, registro) {
          if (err) return console.error(err);
          //console.dir(registro);
          casos++;
          callback();
        });
      }
    });
  },
  function(err){
    // All tasks are done now
    console.dir("Crawler do primeiro site terminado!!! "+casos+" casos registrados.");
  }
)}

//http://portal.mj.gov.br
function crawler2(limite) {
  console.dir("Iniciando crawler do segundo site...");
  //var limite = [19, 199]; // 2512
  var casos=0;

  async.each(limite, function (id, callback) { 
      var url = format('http://portal.mj.gov.br/Desaparecidos/frmCriancaDetalhe.aspx?id=%s', id);
      request(url, function (err, response, body) {
        if (err) throw err;
        
        var $ = cheerio.load(body);
        var status = 'Desaparecido(a)';
        var nome = $('#lblNome').text();
        
        if (nome!=undefined && nome!='') {
          var img = "http://portal.mj.gov.br/Desaparecidos/"+$('#imgFoto1').attr('src');
          var sexo = $('#lblSexo').text();
          var dataNascimento = $('#lblDataNascimento').text();
          var dataDesaparecimento = $('#lblDataDesaparecimento').text();
          var dataDoRegistro = $('#lblDataInclusao').text();
          var alturaAproximada = $('#lblAltura').text();
          var pesoAproximado = $('#lblPeso').text();
          var olhos = $('#lblCorOlhos').text();
          var cabelo = $('#lblCorCabelo').text();
          var raca = $('#lblRaca').text();
          var observacao = $('#lblObservacao').text();
          var dataLocalizacao = $('#lblDataLocalizacao').text();
          if(dataLocalizacao!='' || dataLocalizacao!=undefined) status = "Encontrado(a)";
          var circunstanciasLocalizacao = $('#lblCircunstanciasLocalizacao').text();
          var ufLocalizacao = $('#lblUF').text();
          var fonte = 'http://portal.mj.gov.br/Desaparecidos/frmCriancaDetalhe.aspx?id='+id;
          
          var registro = new Desaparecido({
              nome: nome
            , img: img
            , status: status
            , sexo: sexo
            , dataNascimento: dataNascimento
            , dataDesaparecimento: dataDesaparecimento
            , dataDoRegistro: dataDoRegistro
            , alturaAproximada: alturaAproximada
            , pesoAproximado: pesoAproximado
            , olhos: olhos
            , raca: raca
            , observacao: observacao
            , dataLocalizacao: dataLocalizacao
            , circunstanciasLocalizacao: circunstanciasLocalizacao
            , ufLocalizacao: ufLocalizacao
            , fonte: fonte
          });

          registro.save(function(err, registro) {
            if (err) return console.error(err);
            //console.dir(registro);
            casos++;
            callback();
          });
        }
      })   
    },
    function(err){
      // All tasks are done now
      console.dir("Crawler do segundo site terminado!!! "+casos+" casos registrados.");
    });
}

//http://www.desaparecidosdobrasil.org
function crawler3(limite) {
  
  var estados = ['sao-paulo','rio-de-janeiro','outros-estados/bahia','parana','rio-grande-do-sul','santa-catarina','outros-estados/demais-estados'];
  async.each(estados, function (estado, next) {
    for (var offset = 0; offset < 300; offset = offset+10) {

      var url = format('http://www.desaparecidosdobrasil.org/criancas-desaparecidas/%s?offset=%d', estado, offset);
      request(url, function (err, response, body) {
        if (err) throw err;
        var $ = cheerio.load(body);

         var paginacao = $('div.sites-pagination-info').text();
         paginacao = paginacao.split('de');
         paginacao = paginacao[paginacao.length - 1].trim();
         paginacao = Number(paginacao);

         $('.announcement').each(function () {
           var nome = $(this).find('h4 a').text();

          
             nome = nome.trim();
             var mais = $(this).find('h4 a').attr('href');
             var img = $(this).find('.sites-layout-tile.sites-tile-name-content-2').find('img').attr('src');

             //console.log('\n\nNome: %s\nFoto: %s\nLocal: %s\nLeia mais em: http://www.desaparecidosdobrasil.org%s ', nome, img, estado, mais);

             var verificador = nome + img + estado + mais;
           if (verificador!=undefined || verificador!='') {
             next();
           }
          
           casos++;
            var registro = new Desaparecido({
          nome: nome
        , img: img
        , local: estado
        , mais: "http://www.desaparecidosdobrasil.org"+mais
      });

      registro.save(function(err, registro) {
        if (err) return console.error(err);
        //console.dir(registro);
      });
         });
          
         next();
         console.log('Número de casos: '+casos);
     });
   }
    
 });
}

//http://www.desaparecidos.mg.gov.br
function crawler4() {
  
 var x=[];i=1;while(x.push(i++)<1576);
 async.eachLimit(x, concurrency, function (id, next) {
  
     var url = format('http://www.desaparecidos.mg.gov.br/album.asp?pg=%d', id);

     request(url, function (err, response, body) {
         if (err) throw err;
         var $ = cheerio.load(body);

        //var tabela = $('table tr:nth-child(7)').find('table');
         $('table tr:nth-child(7) table td:nth-child(odd)').each(function () {
           var nome = $(this).find('.txtalbum1').text();
           var mais = $(this).find('table a').attr('href');
           var img = $(this).find('table a img').attr('src');

          //console.log('\n\nNome: %s\nFoto: %s\nLeia mais em: http://www.desaparecidos.mg.gov.br%s ', nome, img, mais);
      var registro = new Desaparecido({
          nome: nome
        , img: img
        , local: "Minas Gerais"
        , mais: "http://www.desaparecidos.mg.gov.br"+mais
      });

      registro.save(function(err, registro) {
        if (err) return console.error(err);
        //console.dir(registro);
      });
           casos++;
          
         });
         next();
         console.log('Número de casos: '+casos);
     });
    
 });
}