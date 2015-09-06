<?php
	include 'conexao.php';
	
	$params = "";
	// Montagem da query e envio dos dados
	if(isset($_POST['submitted']) ) {
		$tipoProcessamento = trim($_POST['tipoProcessamento']);
		// $campus = trim($_POST['campus']);
		// $sexo = trim($_POST['sexo']);
		// $situacao = trim($_POST['situacao']);
		// $cra_aluno = trim($_POST['cra_aluno']);
		// $cod_curso = trim($_POST['cod_curso']);
		// $naturalidade = trim($_POST['naturalidade']);
		$poligono = trim($_POST['poligono']);

		$params .= ($cod_curso!="") ? " AND cod_curso = '".$cod_curso."'" : "";
		$params .= ($sexo!="") ? " AND sexo = '".$sexo."'" : "";
		$params .= ($situacao!="") ? " AND situacao = '".$situacao."'" : "";
		$params .= ($campus!="") ? " AND campus = '".$campus."'" : "";
		$params .= ($cra_aluno!="") ? " AND cra_aluno = '".$cra_aluno."'" : "";
		$params .= ($naturalidade!="") ? " AND naturalidade = '".$naturalidade."'" : "";
		
		if($tipoProcessamento=='python'){
			// envia restrição do polígono caso este tenha sido desenhado no mapa
			if(!empty($poligono)) {
				$query = "SELECT ST_X(geolocalizacao), ST_Y(geolocalizacao) from registro WHERE ST_Intersects(geolocalizacao,ST_Transform(ST_GeomFromText('".$poligono."',3857),4674))".$params.";";
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
				$query = "SELECT ST_X(geolocalizacao), ST_Y(geolocalizacao) from registro WHERE ST_Intersects(geolocalizacao,ST_Transform(ST_GeomFromText('".$poligono."',3857),4674))".$params.";";
			} 
			else {
				$query = "SELECT ST_X(geolocalizacao), ST_Y(geolocalizacao), nome from registro WHERE latitude is not null  ".$params.";";
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
