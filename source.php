<?php
	include 'conexao.php';

	$params = "";
	// Montagem da query e envio dos dados
	if(isset($_POST['submitted']) ) {
		$tipoProcessamento = trim($_POST['tipoProcessamento']);
		//$faixa = trim($_POST['faixa']);
		$sexo = trim($_POST['sexo']);
		$situacao = trim($_POST['situacao']);
		$nome = trim($_POST['nome_desaparecido']);
		$cod_estado = trim($_POST['cod_estado']);
		$cor_da_pele = trim($_POST['raca']);
		$poligono = trim($_POST['poligono']);

		$params .= ($cod_estado!="") ? " AND uf_desaparecimento = '".$cod_estado."'" : "";
		$params .= ($sexo!="") ? " AND sexo = '".$sexo."'" : "";
		$params .= ($situacao!="") ? " AND status ilike '".$situacao."%'" : "";

		//$params .= ($faixa!="") ? " AND campus = '".$faixa."'" : "";

		$params .= ($nome!="") ? " AND nome ilike '".$nome."%'" : "";
		$params .= ($cor_da_pele!="") ? " AND cor_da_pele ilike '".$cor_da_pele."%'" : "";

		if($tipoProcessamento=='python'){
			// envia restrição do polígono caso este tenha sido desenhado no mapa
			if(!empty($poligono)) {
				$query = "SELECT ST_X(geolocalizacao), ST_Y(geolocalizacao) from registro WHERE ST_Intersects(geolocalizacao,ST_Transform(ST_GeomFromText('".$poligono."',3857),4674)) ".$params.";";
			}
			else {
				$query = "SELECT ST_X(geolocalizacao), ST_Y(geolocalizacao), uf_desaparecimento from registro WHERE latitude is not null  ".$params.";";
			}

			exec('python cgi-bin/kde.py "'.$query.'"' , $dataFromPython);

			print_r ((empty($dataFromPython)) ? "python não carregou" : json_encode($dataFromPython));
		}
		else if($tipoProcessamento=='php'){
			// envia restrição do polígono caso este tenha sido desenhado no mapa
			if(!empty($poligono)) {
				$query = "SELECT ST_X(geolocalizacao), ST_Y(geolocalizacao) from registro WHERE ST_Intersects(geolocalizacao,ST_Transform(ST_GeomFromText('".$poligono."',3857),4674)) ".$params.";";
			}
			else {
				$query = "SELECT ST_X(geolocalizacao), ST_Y(geolocalizacao), nome, sexo, cor_da_pele, idade, data_desaparecimento, uf_desaparecimento from registro WHERE latitude is not null  ".$params.";";
			}

			$result = pg_query($query);
			$JSON = json_encode(pg_fetch_all($result));

			pg_free_result($result);
			// seta variável de envio como TRUE
			$sent = true;
			print_r($JSON);
		}
	}
?>
