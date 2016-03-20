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

var registroCrawler1 = new mongoose.Schema({
    nome: { type: String }
  , img: String
  , status: {type: String, default: "Desaparecido(a)"}
  , dataDesaparecimento: String
  , local: String
  , observacao: String
  , boletimOcorrencia: String
  , sexo: String
  , corDaPele: String
  , idadeDesaparecimento: String
  , pesoAproximado: String
  , idadeHoje: String
  , alturaAproximada: String
  , transtornoMental: String
  , olhos: String
  , tipoFisico: String
  , ultimaInformacao: String
  , fonte: String
  , atualizado_em: { type: Date, default: Date.now }
  });

var registroCrawler2 = new mongoose.Schema({
    nome: { type: String }
  , img: String
  , status: {type: String, default: "Desaparecido(a)"}
  , dataNascimento: String
  , dataDesaparecimento: String
  , nomeContato: String
  , telContato: String
  , emailContato: String
  , dataDoRegistro: String
  , sexo: String
  , pesoAproximado: String
  , alturaAproximada: String
  , olhos: String
  , raca: String
  , observacao: String
  , dataLocalizacao: String
  , circunstanciasLocalizacao: String
  , ufLocalizacao: String
  , fonte: String
  , atualizado_em: { type: Date, default: Date.now }
  });

var registroCrawler3 = new mongoose.Schema({
    nome: { type: String }
  , img: String
  , local: String
  , status: {type: String, default: "Desaparecido(a)"}
  , fonte: String
  , informacoes: String
  , mais: String
  , atualizado_em: { type: Date, default: Date.now }
});

var registroCrawler4 = new mongoose.Schema({
    nome: { type: String }
  , img: String
  , status: {type: String, default: "Desaparecido(a)"}
  , fonte: String
  , informacoes: String
  , atualizado_em: { type: Date, default: Date.now }
});

var registroCrawler5 = new mongoose.Schema({
    nome: { type: String }
  , img: String
  , status: {type: String, default: "Desaparecido(a)"}
  , fonte: String
  , informacoes: String
  , atualizado_em: { type: Date, default: Date.now }
});

var registroCrawler6 = new mongoose.Schema({
    nome: { type: String }
  , img: String
  , idade: String
  , status: {type: String, default: "Desaparecido(a)"}
  , dataNascimento: String
  , dataDesaparecimento: String
  , diasDesaparecido: String
  , sexo: String
  , pesoAproximado: String
  , alturaAproximada: String
  , olhos: String
  , corDaPele: String
  , observacao: String
  , informacoes: String
  , cabelo: String
  , local: String
  , fonte: String
  , atualizado_em: { type: Date, default: Date.now }
  });

  var registroCrawler7 = new mongoose.Schema({
    nome: String
    , apelido: String
    , img: String
    , sexo: String
    , cabelo: String
    , corDaPele: String
    , tipoFisico: String
    , nomePai: String
    , nomeMae: String
    , nomeParente: String
    , parentesco: String
    , dataNascimento: String
    , dataDesaparecimento: String
    , marcas: String
    , local: String
    , informacoes: String
    , nomeContato: String
    , telContato: String
    , telContato2: String
    , celularContato: String
    , emailContato: String
    , emailContato2: String
    , fonte: String
    , atualizado_em: { type: Date, default: Date.now }
  });

var registroCrawler8 = new mongoose.Schema({
  nome: String
  , img: String
  , sexo: String
  , dataNascimento: String
  , idade: String
  , dataDesaparecimento: String
  , local: String
  , informacoes: String
  , naturalidade: String
  , boletimOcorrencia: String
  , observacao: String
  , fonte: String
  , atualizado_em: { type: Date, default: Date.now }
});

var RegistroCrawler1 = mongoose.model('RegistroCrawler1', registroCrawler1);
var RegistroCrawler2 = mongoose.model('RegistroCrawler2', registroCrawler2);
var RegistroCrawler3 = mongoose.model('RegistroCrawler3', registroCrawler3);
var RegistroCrawler4 = mongoose.model('RegistroCrawler4', registroCrawler4);
var RegistroCrawler5 = mongoose.model('RegistroCrawler5', registroCrawler5);
var RegistroCrawler6 = mongoose.model('RegistroCrawler6', registroCrawler6);
var RegistroCrawler7 = mongoose.model('RegistroCrawler7', registroCrawler7);
var RegistroCrawler8 = mongoose.model('RegistroCrawler8', registroCrawler8);

mongoose.connect('mongodb://localhost/test_myosotis');

// preparing limits of crawling
var arrCrawler=[];

arrCrawler = generateArray(3018, 3019);
//crawler1(arrCrawler);

arrCrawler = generateArray(2511, 2512);
//crawler2(arrCrawler);

//trocar matriz por hashmap, ex: meuHashMap[nome-do-estado] = valor-de-offset
arrCrawler = [['santa-catarina'], ['outros-estados/demais-estados'], ['rio-de-janeiro'], ['outros-estados/bahia'], ['parana'], ['rio-grande-do-sul'], ['sao-paulo']];
paginacao = [13, 53, 58, 18, 26, 30, 164]
//initCrawler3(arrCrawler, paginacao);

arrCrawler = generateArray(1, 1);//176
//crawler4(arrCrawler);//Ainda falta ser ajustado o funcionamento deste crawler

arrCrawler = generateArray(1, 1);
//crawler5(arrCrawler, false);//menores de 18 anos
//crawler5(arrCrawler, true);//maiores de 18 anos

arrCrawler = generateArray(1, 1);
//crawler6(arrCrawler);

arrCrawler=[];
arrCrawler = generateArray(1, 2);
//crawler7(arrCrawler);

//http://www.policiacivil.go.gov.br/pessoas-desaparecidas
//crawler8(generateArray(1, 2));

function generateArray(ini, end) {
  var arr = [];
  while (ini<=end) { arr.push(ini); ini++; }
  return arr;
}

//http://www.desaparecidos.gov.br
function crawler1 (limite) {
  console.dir("Iniciando crawler do primeiro site...");


  async.each(limite, function (id, callback) {

    var urlSegundoNivel = format('http://www.desaparecidos.gov.br/desaparecidos/application/modulo/detalhes.php?id=%s', id);

    request(urlSegundoNivel, function (err, response, body) {
      if (err) throw err;
      var $ = cheerio.load(body);

      var nome = $('.titulo').text().trim();

      //Só prossegue se tiver pelo menos um nome
      if(nome!="" && nome!=undefined){
        var img = $('img').attr('src');
        var status = $('.desaparecido').text().trim();

        if (status=="" || status==undefined) {
          status = $('.encontrado').text().trim();
        }

        var dataLocal = $('.inf p:nth-child(1)').text().trim();
        dataLocal = dataLocal.split("no município de");
        var dataDesaparecimento = dataLocal[0];
        var local = dataLocal[1];
        var observacao = $('.inf p:nth-child(2)').text().trim();
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


        var registro = new RegistroCrawler1({
            nome: nome
          , img: img
          , status: status
          , dataDesaparecimento: dataDesaparecimento
          , local: local
          , fonte: 'http://www.desaparecidos.gov.br/desaparecidos/application/modulo/detalhes.php?id='+id
          , observacao: observacao
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
          callback();
        });
      }
    });
  },
  function(err){
    // All tasks are done now
    console.dir("Crawler do primeiro site terminado!!!");
  }
)}

//http://portal.mj.gov.br
function crawler2(limite) {
  console.dir("Iniciando crawler do segundo site...");
  //var limite = [19, 199]; // 2512


  async.each(limite, function (id, callback) {
      var url = format('http://portal.mj.gov.br/Desaparecidos/frmCriancaDetalhe.aspx?id=%s', id);
      request(url, function (err, response, body) {
        if (err) throw err;

        var $ = cheerio.load(body);

        var nome = $('#lblNome').text();

        if (nome!=undefined && nome!="") {
          var img = "http://portal.mj.gov.br/Desaparecidos/"+$('#imgFoto1').attr('src');
          var sexo = $('#lblSexo').text();
          var dataNascimento = $('#lblDataNascimento').text();
          var dataDesaparecimento = $('#lblDataDesaparecimento').text();
          var nomeContato = $('#Table2 #lblOrgao').text();
          var telContato = $('#Table2 #lblTelefone').text();
          var emailContato = $('#Table2 #lblEmail').text();
          var dataDoRegistro = $('#lblDataInclusao').text();
          var alturaAproximada = $('#lblAltura').text();
          var pesoAproximado = $('#lblPeso').text();
          var olhos = $('#lblCorOlhos').text();
          var cabelo = $('#lblCorCabelo').text();
          var raca = $('#lblRaca').text();
          var observacao = $('#lblObservacao').text();
          var circunstanciasLocalizacao = $('#lblCircunstanciasLocalizacao').text();
          var ufLocalizacao = $('#lblUF').text();
          var dataLocalizacao = $('#lblDataLocalizacao').text();

          if((ufLocalizacao!="" && ufLocalizacao!=undefined) || (dataLocalizacao!="" && dataLocalizacao!=undefined) || (circunstanciasLocalizacao!="" && circunstanciasLocalizacao!=undefined))
            status='Encontrado(a)';
          else status = "Desaparecido(a)";
          var fonte = 'http://portal.mj.gov.br/Desaparecidos/frmCriancaDetalhe.aspx?id='+id;

          var registro = new RegistroCrawler2({
              nome: nome
            , img: img
            , status: status
            , sexo: sexo
            , dataNascimento: dataNascimento
            , dataDesaparecimento: dataDesaparecimento
            , nomeContato: nomeContato
            , telContato: telContato
            , emailContato: emailContato
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
            callback();
          });
        }
      })
    },
    function(err){
      // All tasks are done now
      console.dir("Crawler do segundo site terminado!!!");
    });
}

//http://www.desaparecidosdobrasil.org
function crawler3(estados, offset) {
  console.dir("Iniciando crawler do terceiro site...");

  async.each(estados, function (estado, next) {

    var url = format('http://www.desaparecidosdobrasil.org/criancas-desaparecidas/%s?offset=%d', estado, offset);
    request(url, function (err, response, body) {
      if (err) throw err;
      var $ = cheerio.load(body);

      $('.announcement').each(function () {
        var nome = $(this).find('h4').text();

        if (nome!=undefined && nome!="") {
          nome = nome.trim();
          var link = $(this).find('a').attr('href');
          var fonte = 'http://www.desaparecidosdobrasil.org';
          var img = $(this).find('img').attr('src');
          var informacoes = $(this).find('blockquote').text();
          var mais = $(this).find('div').text();

          var registro = new RegistroCrawler3({
              nome: nome
            , img: img
            , local: estado
            , fonte: fonte
            , informacoes: informacoes
            , mais: mais
          });

          registro.save(function(err, registro) {
            if (err) return console.error(err);
            //console.dir(registro);
          });
        }
      });
      next();
    });
  },
  function(err){
    // All tasks are done now
    console.dir("Crawler do terceiro site terminado!!!");
  });
}
function initCrawler3(estados, paginacao) {
  for(i=0;i<estados.length; i++)
    for (var offset = 1; offset <= paginacao[i]; offset = offset+10)
      crawler3(estados[i], offset);
}

//http://www.desaparecidos.mg.gov.br
function crawler4(limite) {
  console.dir("Iniciando crawler do quarto site...");
  async.each(limite, function (id, next) {
    var url = format('http://www.desaparecidos.mg.gov.br/album.asp?pg=%s', id);

    request(url, function (err, response, body) {
      if (err) throw err;
      var $ = cheerio.load(body);


      //$('a').each(function () {
        var nome = $(this).find('.txtalbum1').text();
        var link = $(this).find('a').attr('href');
        //var img =  $(this).find('img').attr('src');

        console.dir(nome);
        console.dir(link);
        //console.dir(img);



      //});
      //console.log('Número de : '+);
    });
 },
    function(err){
      // All tasks are done now
      console.dir("Crawler do quarto site terminado!!!");
    }
  );
}

//http://www.desaparecidos.rs.gov.br
function crawler5(ids, ehMaior) {

  console.dir("Iniciando crawler do quinto site...");
  var auxURL = '504/desaparecidos-menores-de-18-anos';

  if(ehMaior){
    auxURL = '505/desaparecidos-maiores-de-18-anos'
  }

  async.each(ids, function (id, callback) {

    var urlSegundoNivel = format("http://www.desaparecidos.rs.gov.br/lista/%s/%s", auxURL, id);

    request(urlSegundoNivel, function (err, response, body) {
      if (err) throw err;
      var $ = cheerio.load(body);
      $('.cConteudoListaItem').each(function () {
        var nome = $(this).find('h1 a').text().trim();

        if(nome!="" && nome!=undefined){
          var img = $(this).find('img').attr('src');
          var informacoes = '';

          $(this).find('p').each(function(){
            informacoes+= $(this).text()+'$$$$';
          });

          var registro = new RegistroCrawler5({
            nome: nome
            , img: img
            , fonte: 'http://www.desaparecidos.rs.gov.br/lista/'+auxURL+'/' + id
            , informacoes: informacoes
          });

          registro.save(function(err, registro) {
            if (err) return console.error(err);
            //console.dir(registro);

          });
        }
      });
      callback();
    })
  },
  function(err){
    // All tasks are done now
    console.dir("Crawler do quinto site terminado!!!");
  })
}

//http://www.biamap.com.br/
function crawler6 (limite) {
  console.dir("Iniciando crawler do sexto site...");

  async.forEach(limite, function (id, callback) {

    var url = format('http://www.biamap.com.br/page/%s/', id);

    request(url, function (err, response, body) {
      if (err) throw err;
      var $ = cheerio.load(body);

      //urls.push($('.desaparecido a').text().trim());
      //console.dir(urls);
      $('.desaparecido').each(function(){
        var url2 = $(this).find('.thumb a').attr('href');
        var idade = $(this).find('span[itemprop="age"]').text().trim();

        // >30 tamanho seguro pra não pegar outros links
        if(url2.length>30){

          request(url2, function (err, response, body) {
            if (err) throw err;
            var $ = cheerio.load(body);

            var nome = $('.entry-title').text().trim();
            var img = $('.gallery img').attr('src');
            var sexo = $('span[itemprop="gender"]').text().trim();
            var dataNascimento = $('span[itemprop="birthdate"]').text().trim();
            var alturaAproximada = $('.altura').text().trim();
            var pesoAproximado = $('span[itemprop="weight"]').text().trim();
            var cabelo = $('span[itemprop="hair"]').text().trim();
            var olhos = $('span[itemprop="olhos"]').text().trim();
            var corDaPele = $('.pele').text().trim();
            var outros = $('.outros').text().trim();
            var diasDesaparecido = $('.daystolost').text().trim();
            var dataDesaparecimento = $('span[itemprop="lostdate"]').text().trim();
            var local = $('span[itemprop="lostlocal"]').text().trim();
            var informacoes = $('.aboutlost').text().trim();


            var registro = new RegistroCrawler6({
              nome: nome
              , img: img
              , idade: idade
              , dataNascimento: dataNascimento
              , dataDesaparecimento: dataDesaparecimento
              , diasDesaparecido: diasDesaparecido
              , sexo: sexo
              , pesoAproximado: pesoAproximado
              , alturaAproximada: alturaAproximada
              , olhos: olhos
              , corDaPele: corDaPele
              , observacao: outros
              , informacoes: informacoes
              , cabelo: cabelo
              , local: local
              , fonte: url2
            });

            registro.save(function(err, registro) {
              if (err) return console.error(err);
              //console.dir(registro);
            });
          });
        }
      });
      callback();
    });
  },
  function(err){
    // All tasks are done now
    console.dir("Crawler do sexto site terminado!!!");
  })
}

//http://www.desaparecidosbr.com.br/
function crawler7 (limite) {
  console.dir("Iniciando crawler do setimo site...");

  async.each(limite, function (id, callback) {

    var url = format('http://www.desaparecidosbr.com.br/resultados.php?pagina=%s&genero=&palavra=', id);
    console.dir(url);
    request(url, function (err, response, body) {
      if (err) throw err;
      var $ = cheerio.load(body);

      $('.linkpreto10').each(function(){
        var url2 = $(this).find('tr:nth-child(1)').attr('onclick');
        var apelido = $(this).find('.preto10 tr:nth-child(3)').text().trim();
        var img = $(this).find('tr:nth-child(2) td img').attr('src');
        console.dir(url2);
        if(url2 != undefined){
          url2 = url2.replace("javascript: location.href=\'", "");
          url2 = url2.replace("\';","");
          url2 = "http://www.desaparecidosbr.com.br/"+url2;

          request(url2, function (err, response, body) {
            if (err) throw err;
            var $ = cheerio.load(body);

            var nome = $('.preto10 .preto10 tr:nth-child(1) td:nth-child(2)').text().trim();
            var sexo = $('.preto10 .preto10 tr:nth-child(2) td:nth-child(2)').text().trim();
            var cabelo = $('.preto10 .preto10 tr:nth-child(3) td:nth-child(2)').text().trim();
            var corDaPele = $('.preto10 .preto10 tr:nth-child(4) td:nth-child(2)').text().trim();
            var tipoFisico = $('.preto10 .preto10 tr:nth-child(5) td:nth-child(2)').text().trim();
            var nomePai = $('.preto10 .preto10 tr:nth-child(6) td:nth-child(2)').text().trim();
            var nomeMae = $('.preto10 .preto10 tr:nth-child(7) td:nth-child(2)').text().trim();
            var nomeParente = $('.preto10 .preto10 tr:nth-child(8) td:nth-child(2)').text().trim();
            var parentesco = $('.preto10 .preto10 tr:nth-child(9) td:nth-child(2)').text().trim();
            var dataNascimento = $('.preto10 .preto10 tr:nth-child(10) td:nth-child(2)').text().trim();
            var dataDesaparecimento = $('.preto10 .preto10 tr:nth-child(11) td:nth-child(2)').text().trim();
            var marcas = $('.preto10 .preto10 tr:nth-child(12) td:nth-child(2)').text().trim();
            var local = $('.preto10 .preto10 tr:nth-child(13) td:nth-child(2)').text().trim();
            var informacoes = $('.preto10 .preto10 tr:nth-child(14) td:nth-child(2)').text().trim();
            var nomeContato = $('.preto10 .preto10 tr:nth-child(16) td:nth-child(2)').text().trim();
            var telContato = $('.preto10 .preto10 tr:nth-child(17) td:nth-child(2)').text().trim();
            var telContato2 = $('.preto10 .preto10 tr:nth-child(18) td:nth-child(2)').text().trim();
            var celularContato = $('.preto10 .preto10 tr:nth-child(19) td:nth-child(2)').text().trim();
            var emailContato = $('.preto10 .preto10 tr:nth-child(20) td:nth-child(2)').text().trim();
            var emailContato2 = $('.preto10 .preto10 tr:nth-child(21) td:nth-child(2)').text().trim();

            var registro = new RegistroCrawler7({
              nome: nome
              , apelido: apelido
              , img: img
              , sexo: sexo
              , cabelo: cabelo
              , corDaPele: corDaPele
              , tipoFisico: tipoFisico
              , nomePai: nomePai
              , nomeMae: nomeMae
              , nomeParente: nomeParente
              , parentesco: parentesco
              , dataNascimento: dataNascimento
              , dataDesaparecimento: dataDesaparecimento
              , marcas: marcas
              , local: local
              , informacoes: informacoes
              , nomeContato: nomeContato
              , telContato: telContato
              , telContato2: telContato2
              , celularContato: celularContato
              , emailContato: emailContato
              , emailContato2: emailContato2
              , fonte: url2
            });

            registro.save(function(err, registro) {
              if (err) return console.error(err);
              //console.dir(registro);
            });
          });
        }
      });
      callback();
    });
  },
  function(err){
    // All tasks are done now
    console.dir("Crawler do setimo site terminado!!!");
  })
}

function crawler8 (limite) {
  console.dir("Iniciando crawler do oitavo site...");

  async.each(limite, function (id, callback) {

    var url = format('http://www.policiacivil.go.gov.br/pessoas-desaparecidas/page/%s', id);

    request(url, function (err, response, body) {
      if (err) throw err;
      var $ = cheerio.load(body);

      $('#archive-posts .post-container').each(function(){
        var url2 = $(this).find('.post-thumb a').attr('href');
        var informacoes = $(this).find('.entry-summary').text().trim();
        var img = $(this).find('.post-thumb img').attr('src');
        var nome = $(this).find('.title-h3').text().trim();

        if(url2 != undefined){

          request(url2, function (err, response, body) {
            if (err) throw err;
            var $ = cheerio.load(body);

            var sexo = $('.entry-content h3:nth-child(2)').text().trim();
            var dataNascimento = $('.entry-content h3:nth-child(3)').text().trim();
            var idade = $('.entry-content h3:nth-child(4)').text().trim();
            var dataDesaparecimento = $('.entry-content h3:nth-child(5)').text().trim();
            var boletimOcorrencia = $('.entry-content h3:nth-child(6)').text().trim();
            var naturalidade = $('.entry-content h3:nth-child(7)').text().trim();
            var observacao = $('.entry-content h3:nth-child(8)').text().trim();
            var local = $('.entry-content h3:nth-child(9)').text().trim();
            var informacoes = informacoes+$('.news-info').text().trim();

            var registro = new RegistroCrawler8({
              nome: nome
              , img: img
              , sexo: sexo
              , dataNascimento: dataNascimento
              , idade: idade
              , dataDesaparecimento: dataDesaparecimento
              , local: local
              , informacoes: informacoes
              , naturalidade: naturalidade
              , boletimOcorrencia: boletimOcorrencia
              , observacao: observacao
              , fonte: url2
            });

            registro.save(function(err, registro) {
              if (err) return console.error(err);
              //console.dir(registro);
            });
          });
        }
      });
      callback();
    });
  },
  function(err){
    // All tasks are done now
    console.dir("Finalizando crawler do oitavo site...");
  })
}
