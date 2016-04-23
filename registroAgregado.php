<?php
	include 'conexao.php';
	
	$header = '<!DOCTYPE html>
				<html>
    				<head>
        				<title>Projeto Myosotis | Visualização de Registro</title>
        				<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        				<meta name="apple-mobile-web-app-capable" content="yes">
        				<meta name="author" content="Raul Sena Ferreira">
        				<!-- Stylesheets -->
				        <link href="css/myosotis.css" rel="stylesheet" type="text/css" />
				        <!-- Font -->
				        <link href="font-awesome-4.2.0/css/font-awesome.min.css" rel="stylesheet">
        			</head>
        			<body>
        				<div class="content_detail">';
	
	$query = "SELECT nome, imagem, sexo, olhos, cor_da_pele, cabelo, peso_aproximado, altura_aproximada, tipo_fisico, transtorno_mental, idade, data_nascimento, dias_desaparecido, data_desaparecimento, bairro_desaparecimento, cidade_desaparecimento, uf_desaparecimento, marca_caracteristica, status, informacoes, boletim_ocorrencia, fonte, longitude, latitude from registro WHERE latitude is not null AND nome = '".htmlspecialchars($_GET['nome'])."';";
	
	$result = pg_query($query);
	$JSON = pg_fetch_row($result);
	
	pg_free_result($result);
	$nome = '<div id="nome"><h2>Não informado</h2></div>';
	$imagem = '<div id="imagem">Não informado</div>';
	$sexo = '<div id="sexo">Não informado</div>';
	$olhos = '<div id="olhos">Não informado</div>';
	$cabelo = '<div id="cabelo">Não informado</div>';
	$cor_da_pele ='<div id="cor_da_pele">Não informado</div>';
	$peso_aproximado = '<div id="peso_aproximado">Não informado</div>';
	$altura_aproximada = '<div id="altura_aproximada">Não informado</div>';
	$tipo_fisico = '<div id="tipo_fisico">Não informado</div>';
	$transtorno_mental = '<div id="transtorno_mental">Não informado</div>';
	$idade = '<div id="idade">Não informado</div>';
	$data_nascimento = '<div id="data_nascimento">Não informado</div>';
	$dias_desaparecido = '<div id="dias_desaparecido">Não informado</div>';
	$data_desaparecimento = '<div id="data_desaparecimento">Não informado</div>';
	$bairro_desaparecimento = '<div id="bairro_desaparecimento">Não informado</div>';
	$cidade_desaparecimento = '<div id="cidade_desaparecimento">Não informado</div>';
	$uf_desaparecimento = '<div id="uf_desaparecimento">Não informado</div>';
	$marca_caracteristica = '<div id="marca_caracteristica">Não informado</div>';
	$status='';
	$informacoes = '<div id="informacoes"></div>';
	$boletim_ocorrencia = '<div id="boletim_ocorrencia">Não informado</div>';
	$fonte = '';
	$longitude = '<div id="longitude">Desconhecida</div>';
	$latitude = '<div id="latitude">Desconhecida</div>';

	if($JSON[0]!='') $nome = '<div id="nome"><h2>'.$JSON[0].'</h2></div>';
	if($JSON[1]!='') $imagem = '<div id="imagem"><img src="'.$JSON[1].'"></div>';
	if($JSON[2]!=''){if($JSON[2]=='M') $sexo = '<div id="sexo"><b>Sexo:</b> Masculino</div>'; else if($JSON[2]=='F') $sexo = '<div id="sexo">Sexo: Feminino</div>'; }
	if($JSON[3]!='') $olhos = '<div id="olhos"><b>Olhos:</b> '.$JSON[3].'</div>';
	if($JSON[4]!='') $cor_da_pele = '<div id="cor_da_pele"><b>Cor:</b> '.$JSON[4].'</div>';
	if($JSON[5]!='') $cabelo = '<div id="cabelo"><b>Cabelo:</b> '.$JSON[5].'</div>';
	if($JSON[6]!='') $peso_aproximado = '<div id="peso_aproximado"><b>Peso aproximado:</b> '.$JSON[6].'</div>';
	if($JSON[7]!='') $altura_aproximada = '<div id="altura_aproximada"><b>Altura aproximada:</b> '.$JSON[7].'</div>';
	if($JSON[8]!='') $tipo_fisico = '<div id="tipo_fisico"><b>Tipo físico:</b> '.$JSON[8].'</div>';
	if($JSON[9]!='') $transtorno_mental = '<div id="transtorno_mental"><b>Transtorno mental:</b> '.$JSON[9].'</div>';
	if($JSON[10]!='') $idade = '<div id="idade"><b>Idade:</b> '.$JSON[10].'</div>';
	if($JSON[11]!='') $data_nascimento = '<div id="data_nascimento"><b>Data nascimento:</b> '.$JSON[11].'</div>'; 
	if($JSON[12]!='') $dias_desaparecido = '<div id="dias_desaparecido"><b>Dias desaparecido:</b> '.$JSON[12].'</div>';
	if($JSON[13]!='') $data_desaparecimento = '<div id="data_desaparecimento"><b>Data desaparecimento:</b> '.$JSON[13].'</div>';
	if($JSON[14]!='') $bairro_desaparecimento = '<div id="bairro_desaparecimento"><b>Bairro:</b> '.$JSON[14].'</div>';
	if($JSON[15]!='') $cidade_desaparecimento = '<div id="cidade_desaparecimento"><b>Cidade:</b> '.$JSON[15].'</div>';
	if($JSON[16]!='') $uf_desaparecimento = '<div id="uf_desaparecimento"><b>Estado:</b> '.$JSON[16].'</div>';
	if($JSON[17]!='') $marca_caracteristica = '<div id="marca_caracteristica"><b>Marca:</b> '.$JSON[17].'</div>'; 
	if($JSON[18]!='') {$status = '<div id="status"><b>Status:</b> '; if($JSON[18]=="Encontrado(a)") $status.='<p class="found">'.$JSON[18].'</p>'; else if($JSON[18]=="Desaparecido(a)") $status.='<p class="missing">'.$JSON[18].'</p>'; $status.='</div>';}
	if($JSON[19]!='') $informacoes = '<div id="informacoes"><b>Mais informações:</b> '.$JSON[19].'</div>';
	if($JSON[20]!='') $boletim_ocorrencia = '<div id="boletim_ocorrencia"><b>B.O.:</b> '.$JSON[20].'</div>'; 
	if($JSON[21]!='') $fonte = '<div id="fonte"><b>Fonte:</b> <a href="'.$JSON[21].'" target="_blank">'.$JSON[21].'</a></div>';
	if($JSON[22]!='') $longitude = '<div id="longitude"><b>Longitude:</b> '.$JSON[22].'</div>';
	if($JSON[23]!='') $latitude = '<div id="latitude"><b>Latitude:</b> '.$JSON[23].'</div>';
	
	print_r($header);
	print_r($nome.$imagem);
	print_r('<div class="box">');
	print_r($idade.$sexo.$olhos.$cor_da_pele.$cabelo);
	print_r('</div>');
	print_r('<div class="box">');
	print_r($tipo_fisico.$marca_caracteristica.$transtorno_mental.$peso_aproximado.$altura_aproximada);
	print_r('</div>');
	print_r('<div class="box">');
	print_r($data_nascimento.$dias_desaparecido.$data_desaparecimento.$bairro_desaparecimento.$cidade_desaparecimento.$uf_desaparecimento);
	print_r('</div>');
	print_r('<div class="box">');
	print_r($status.$boletim_ocorrencia.$longitude.$latitude);
	print_r('</div>');
	print_r($informacoes.$fonte.'<div></body></html>');
?>
