/*
 * Data : ce service gèrent les requêtes REST
 */
Services.factory('Data', ['$resource', '$filter', '$routeParams', '$log', 'localStorageService', 'Notification',
    function ($resource, $filter, $routeParams, $log, localStorageService, Notification){

        /*
         * Test pour résoudre le problème des navigateurs non compatibles avec localStorage
         * GLOBALS
         * @DATA : stocke les données des RDV
         * @DATA_DATE : date de dernière mise à jour des données
         */
        var DATA = [],
            DATA_DATE = null;

        var request = {
            /*
             * Vérifie si les données sont dans localStorage et sont à jour
             */
            statusData : function (){

                var status = false;

                if(localStorageService.isSupported){

                    if(localStorageService.get("data-rdv") !== null && localStorageService.get("data-rdv-date") !== null){

                        status = true;
                    }
                }else{

                    $log.warn("localStorage n'est pas supporté");
                }

                return status;
            },
            /*
             * Récupère la liste de tous les évènements pour un assuré et ses bénéficiaires
             * A FAIRE : passer les paramètres
             *
             * @params : {
             * 		forceUpdate : booleen, force la mise à jour depuis le serveur
             *
             * }
             */
            getRdvList : function (params){

                /*
                 * Depuis localStorage si @params.forceUpdate = null
                 */
                if(request.statusData() === true && params.forceUpdate === false){

                    $log.info('Données chargées depuis localStorage. params.forceUpdate = ', params.forceUpdate);

                    return localStorageService.get("data-rdv");
                }

                $log.info('Données chargées depuis le serveur. params.forceUpdate = ', params.forceUpdate);

                /*
                 * Depuis REST
                 * A FAIRE : URL de l'API distante
                 */
                var resource = $resource('datas/data.json', {}, {
                    query : {
                        method : 'GET',
                        params : {},
                        isArray : true,
                        responseType : 'json',
                        transformResponse : function (data){

                            /*
                             * @dateLastData : date des dernières données dans localStorage
                             */
                            var dateLastData = localStorageService.isSupported && localStorageService.get("data-rdv-date") !== null ? localStorageService.get("data-rdv-date") : null;

                            $log.info("Date des dernières données : " + dateLastData);

                            /*
                             * @compteurNotifications : nombre de notifications envoyées
                             */
                            var compteurNotifications = 0;

                            /*
                             * @arrItems : liste de tous les évènements
                             */
                            var arrItems = [];

                            angular.forEach(data, function (item){

                                /*
                                 * Ajoute la date sans l'heure pour le regroupement par date
                                 *
                                 * INFO : IE plante ici car ne sait pas faire un .split()
                                 */
                                var date = $filter('date')(item.date, "dd/MM/yyyy").split('/');


                                var timestamp = new Date(date[1] + '/' + date[0] + '/' + date[2]).getTime();

                                item.dateJour = timestamp;

                                /*
                                 * Ajoute l'item dans le tableau des RDV
                                 */
                                arrItems.push(item);

                                /*
                                 * Si la date du remboursement est plus récente que la date des dernières données on affiche une notification
                                 * Risque : s'il y'a trop de notifications
                                 */
                                if(dateLastData !== null){

                                    if(item.remboursement.date > dateLastData && item.etat === true && compteurNotifications < 3){

                                        Notification.send({
                                            id : item.id,
                                            titre : 'Nouveau remboursement',
                                            body : "Vous avez reçu un remboursement le " + $filter('date')(item.remboursement.date, 'dd/MM/yyyy') + " d'un montant de " + item.remboursement.montant + "€.",
                                            icon : item.beneficiaire.avatar
                                        });

                                        /*
                                         * Incrémente le compteur
                                         */
                                        compteurNotifications++;
                                    }
                                }
                            });

                            /*
                             * Timestamp actuel
                             */
                            var dateNow = new Date().getTime();

                            /*
                             * On stocke les données dans DATA et DATA_DATE
                             */
                            DATA = arrItems;

                            DATA_DATE = dateNow;

                            /*
                             *  Si localStorage est supporté on l'utilise
                             */
                            if(localStorageService.isSupported){

                                /*
                                 * On sauvegarde les datas dans localStorage pour optimiser
                                 */
                                localStorageService.set("data-rdv", arrItems);

                                /*
                                 * On sauvegarde la date de la mise à jour des données
                                 */
                                localStorageService.set("data-rdv-date", dateNow);
                            }

                            /*
                             * On renvoie l'objet
                             */
                            return arrItems;
                        }
                    }
                });

                return resource.query();
            },
            /*
             * Récupère le détail d'un évènement
             */
            getRdvDetail : function (){

                /*
                 * @data : tous les évènements
                 * @result : détail d'un évènement
                 */
                var data, result = null;

                data = request.statusData() === true ? localStorageService.get("data-rdv") : request.getRdvList();

                /*
                 * On parcoure l'objet à la recherche de notre évènement
                 */
                angular.forEach(data, function (item){

                    if(item.id === parseInt($routeParams.id, 0)){

                        result = item;
                    }
                });

                return result;
            },
            /*
             * Supprimer un évènement
             */
            deleteRdv : function (){

                var data = request.statusData() === true ? localStorageService.get("data-rdv") : request.getRdvList();

                /*
                 * Nouvel objet qui contient les évènement
                 */
                var arrData = [];

                angular.forEach(data, function (item){

                    if(item.id !== parseInt($routeParams.id, 0)){

                        arrData.push(item);
                    }
                });

                /*
                 * Mise à jour dans DATA
                 */
                DATA = arrData;

                /*
                 * Mise à jour des donnés dans localStorage
                 */
                if(localStorageService.isSupported){

                    localStorageService.set("data-rdv", arrData);
                }
            },
            /*
             * Mise à jour d'un évènement
             */
            updateRdv : function (params){

                var data = request.statusData() === true ? localStorageService.get("data-rdv") : request.getRdvList();

                /*
                 * Nouvel objet qui contient les évènement
                 */
                var arrData = [];

                angular.forEach(data, function (item){

                    if(item.id === parseInt($routeParams.id)){

                        angular.forEach(params, function (value, param){

                            /*
                             * Met l'élement avec la nouvelle valeur
                             */
                            item[param] = value;
                        });
                    }

                    arrData.push(item);
                });

                /*
                 * Mise à jour dans DATA
                 */
                DATA = arrData;

                /*
                 * Mise à jour des donnés dans localStorage
                 */
                if(localStorageService.isSupported){

                    localStorageService.set("data-rdv", arrData);
                }
            },
            /*
             * Vérfie le login et mot de passe
             * @params : {
             *		nir : numéro SS
             *		password : mot de passe Ameli
             *	}
             *
             *	A FAIRE :
             */
            loginUser : function (params){

                return true;
            }
        };

        return request;
    }]);


