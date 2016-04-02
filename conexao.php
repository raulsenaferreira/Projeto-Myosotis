<?php

$myfile = fopen("/cgi-bin/config.txt", "r") or die("Unable to open file!");
$connectString = fread($myfile,filesize("/cgi-bin/config.txt"));
fclose($myfile);

$link = pg_connect($connectString);

if(!$link){
	die('Erro de conexão: ' . pg_last_error());
}

?>
