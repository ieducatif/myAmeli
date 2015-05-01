<?php

/*
  Routeur
  @route : API que l'on veut charger
 */
//require_once('inc/bdd.php');

if(isset($_REQUEST['route']) && !empty($_REQUEST['route'])){

    $route = trim(strip_tags($_REQUEST['route']));

    switch($route){

        case 'rdv':

            require_once('class/Rdv.php');

            $rdv = new Rdv($_REQUEST);

            break;

        case 'ps':

            require_once('class/Ps.php');

            $ps = new Ps($_REQUEST);

            break;

        default:

            exit;
            break;
    }
}