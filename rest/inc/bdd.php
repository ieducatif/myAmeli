<?php
/*
  Paramètres de la base
 */
$params = array(
    'host' => 'localhost' ,
    'user' => 'root' ,
    'pass' => '' ,
    'base' => 'myameli');

/*
  Connexion à mysql
 */
$db = new mysqli($params['host'] , $params['user'] , $params['pass'] , $params['base']);

if($db -> connect_errno){

    die("Erreur de connexion à mysql");
}