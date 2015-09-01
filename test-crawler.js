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

var RegistroCrawler1 = mongoose.model('RegistroCrawler1', registroCrawler1);
var RegistroCrawler2 = mongoose.model('RegistroCrawler2', registroCrawler2);
var RegistroCrawler5 = mongoose.model('RegistroCrawler5', registroCrawler5);
var RegistroCrawler6 = mongoose.model('RegistroCrawler6', registroCrawler6);

mongoose.connect('mongodb://localhost/test_myosotis');

// preparing limits of crawling
var arrCrawler=[];

arrCrawler = generateArray(3018, 3019, arrCrawler);
//crawler1(arrCrawler);

arrCrawler = generateArray(2511, 2512, arrCrawler);
//crawler2(arrCrawler);

arrCrawler =  ['sao-paulo'];
crawler3(arrCrawler);

arrCrawler = generateArray(1, 1, arrCrawler);//176
//crawler4(arrCrawler);//Ainda falta ser ajustado o funcionamento deste crawler

arrCrawler = generateArray(1, 1, arrCrawler);
//crawler5(arrCrawler);

arrCrawler = generateArray(1, 1, arrCrawler);
//crawler6(arrCrawler);

function generateArray(ini, end, arr) {
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
          ++;
          callback();
        });
      }
    });
  },
  function(err){
    // All tasks are done now
    console.dir("Crawler do primeiro site terminado!!! "++"  registrados.");
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
            ++;
            callback();
          });
        }
      })   
    },
    function(err){
      // All tasks are done now
      console.dir("Crawler do segundo site terminado!!! "++"  registrados.");
    });
}

//http://www.desaparecidosdobrasil.org
function crawler3(estados) {
  console.dir("Iniciando crawler do terceiro site...");
  
  var paginacao = 2;
  for (var offset = 1; offset <= paginacao; offset = offset+10) {
    async.each(estados, function (estado, next) {
    
      var url = format('http://www.desaparecidosdobrasil.org/criancas-desaparecidas/%s?offset=%d', estado, offset);
      request(url, function (err, response, body) {
        if (err) throw err;
        var $ = cheerio.load(body);

        paginacao = $('div.sites-pagination-info').text();
        paginacao = paginacao.split('de');
        paginacao = paginacao[paginacao.length - 1].trim();
        paginacao = Number(paginacao);

        $('.announcement').each(function () {
          var nome = $(this).find('h4').text();
          
          if (nome!=undefined && nome!="") {      
            nome = nome.trim();
            var link = $(this).find('a').attr('href');
            var fonte = 'http://www.desaparecidosdobrasil.org';
            var img = $(this).find('img').attr('src');
            var metaDados = $(this).find('blockquote').text();
            var ultimaInformacao = $(this).find('.timestamp').text();

            console.dir(nome);
            console.dir(fonte);
            console.dir(img);
            console.dir(ultimaInformacao);
            console.dir(metaDados);
            console.dir(link);

            var registro = new Desaparecido({
                nome: nome
              , img: img
              , local: estado
              , fonte: fonte
              , metaDados: metaDados
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
}

//http://www.desaparecidos.mg.gov.br
function crawler4(limite) {
  console.dir("Iniciando crawler do quarto site...");
  async.each(limite, function (id, next) {
    var url = format('http://www.desaparecidos.mg.gov.br/album.asp?pg=%s', id);
    
    request(url, function (err, response, body) {
      if (err) throw err;
      var $ = cheerio.load(body);

      
      $('a').each(function () {
        var nome = $(this).text();
        var link = $(this).attr('href');
        

        console.dir(nome);
        console.dir(img);
        

         
      });
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
function crawler5(ids) {

  console.dir("Iniciando crawler do quinto site...");
 
  
  async.each(ids, function (id, callback) { 
    
    var urlSegundoNivel = format("http://www.desaparecidos.rs.gov.br/lista/504/desaparecidos-menores-de-18-anos/%s", id);
    
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
            , fonte: 'http://www.desaparecidos.rs.gov.br/lista/504/desaparecidos-menores-de-18-anos/' + id
            , informacoes: informacoes
          });

          registro.save(function(err, registro) {
            if (err) return console.error(err);
            //console.dir(registro);
            ++;
            
          });
        }
      });
      callback();        
    })
  },
  function(err){
    // All tasks are done now
    console.dir("Crawler do quinto site terminado!!! "++"  registrados.");
  })
}

//http://www.biamap.com.br/
function crawler6 (limite) {
  console.dir("Iniciando crawler do sexto site...");
  var urls=[];

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

        // >30 tamanho seguro pra não pegar outros link
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