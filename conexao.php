<?php
//ini_set('display_errors', 1); error_reporting(E_ALL);//for debug

$myfile = fopen(realpath(dirname(__FILE__))."/cgi-bin/config.txt", "r") or die("Unable to open file!");
$connectString = fread($myfile,filesize(realpath(dirname(__FILE__))."/cgi-bin/config.txt"));
fclose($myfile);

$link = pg_connect($connectString);

if(!$link){
	die('Erro de conexão: ' . pg_last_error());
}

?>
