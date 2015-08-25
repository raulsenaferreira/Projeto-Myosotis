<?php

$host = 'host';
$port = 'porta';
$database = 'banco';
$user = 'usuario';
$password = 'senha';

$connectString = 'host=' . $host . ' port=' . $port . ' dbname=' . $database . 
	' user=' . $user . ' password=' . $password;

$link = pg_connect($connectString);

if(!$link){
	die('Erro de conexão: ' . pg_last_error());
}

?>
