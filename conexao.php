<?php

$host = 'localhost';
$port = '5432';
$database = 'database';
$user = 'user';
$password = 'pass';

$connectString = 'host=' . $host . ' port=' . $port . ' dbname=' . $database . 
	' user=' . $user . ' password=' . $password;

$link = pg_connect($connectString);

if(!$link){
	die('Erro de conexão: ' . pg_last_error());
}

?>
