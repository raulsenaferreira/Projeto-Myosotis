<?php
	include 'conexao.php';
	
	$params = "";
	// Montagem da query e envio dos dados
	if(isset($_POST['submitted']) ) {
		$tipoProcessamento = trim($_POST['tipoProcessamento']);
		$campus = trim($_POST['campus']);
		$sexo = trim($_POST['sexo']);
		$situacao = trim($_POST['situacao']);
		$cra_aluno = trim($_POST['cra_aluno']);
		$cod_curso = trim($_POST['cod_curso']);
		$naturalidade = trim($_POST['naturalidade']);
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
				$query = "SELECT ST_X(geom), ST_Y(geom) from alunos_rural WHERE ST_Intersects(geom,ST_Transform(ST_GeomFromText('".$poligono."',3857),4326))".$params.";";
			} 
			else {
				$query = "SELECT ST_X(geom), ST_Y(geom) from alunos_rural WHERE latitude != 0 ".$params.";";
			}

			exec('python cgi-bin/kde.py "'.$query.'"' , $dataFromPython);
			
			echo (empty($dataFromPython)) ? "python não carregou" : json_encode($dataFromPython);
		}
		else if($tipoProcessamento=='php'){
			// envia restrição do polígono caso este tenha sido desenhado no mapa
			if(!empty($poligono)) {
				$query = "SELECT ST_X(geom), ST_Y(geom), bolsista, nascimento, cra, naturalidade, cod_curso, sexo, forma_ingresso, campus, crm from alunos_rural WHERE ST_Intersects(geom,ST_Transform(ST_GeomFromText('".$poligono."',3857),4326))".$params.";";
			} 
			else {
				$query = "SELECT ST_X(geom), ST_Y(geom), bolsista, nascimento, cra, naturalidade, cod_curso, sexo, forma_ingresso, campus, crm from alunos_rural WHERE latitude != 0".$params.";";
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
