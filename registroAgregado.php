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
        			</head>
        			<body>';
	
	$query = "SELECT nome, imagem, sexo, olhos, cor_da_pele, cabelo, peso_aproximado, altura_aproximada, tipo_fisico, transtorno_mental, idade, data_nascimento, dias_desaparecido, data_desaparecimento, bairro_desaparecimento, cidade_desaparecimento, uf_desaparecimento, marca_caracteristica, status, informacoes, boletim_ocorrencia, fonte, longitude, latitude from registro WHERE latitude is not null AND nome = '".htmlspecialchars($_GET['nome'])."';";
	
	$result = pg_query($query);
	$JSON = json_encode(pg_fetch_all($result));
	
	pg_free_result($result);
	
	//print_r($JSON);

	$html='<div id="nome">'.$JSON.'</div>';
	echo $header.$html.'</body></html>';
	
?>
