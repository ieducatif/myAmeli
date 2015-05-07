/*
 * Data : ce service gèrent les requêtes REST
 */
Services.factory('Data', ['$resource', '$filter', '$routeParams', '$interval', '$log', 'localStorageService', 'Notification',
    function ($resource, $filter, $routeParams, $interval, $log, localStorageService, Notification){

        /*
         * Test pour résoudre le problème des navigateurs non compatibles avec localStorage
         * @DATA : stocke les données des RDV
         * @DATA_DATE : date de dernière mise à jour des données
         */
        var DATA = [],
            DATA_DATE = null;

        var request = {
            /*
             * Vérifie si les données sont dans localStorage et sont à jour
             */
            isData : function (){

                var status = false;

                if(localStorageService.isSupported){

                    if(localStorageService.get("data-rdv") !== null && localStorageService.get("data-rdv-date") !== null){

                        status = true;

                        /*
                         * Vérifie si les données ne sont pas périmées
                         * + d'1 jour
                         */
                        if(localStorageService.get("data-rdv-date") < (new Date().getTime() - (3600 * 24))){

                            status = false;
                        }
                    }
                }

                return status;
            },
            /*
             * Liste tous les RDV de l'assuré et de ses bénéficiaires
             *
             * @params : {
             *  forceUpdate : force la mise à jour depuis le serveur,
             *  user : NIR de l'utilisateur
             * }
             */
            getRdvList : function (params){

                /*
                 * Données locales
                 *
                 * Charge les données depuis localStorage si elles sont présentes et si elles sont à jour
                 */
                if(request.isData() === true && params.forceUpdate === false){

                    $log.info('Données chargées depuis localStorage. params.forceUpdate = ', params.forceUpdate);

                    return localStorageService.get("data-rdv");
                }

                $log.info('Données chargées depuis le serveur. params.forceUpdate = ', params.forceUpdate);

                /*
                 * Données distantes
                 *
                 * A FAIRE : URL de l'API distante
                 */
                var urlData = '../datas/data-rdv.json';

                var resource = $resource(urlData, {}, {
                    query : {
                        method : 'GET',
                        params : {user : request.getUser()},
                        isArray : true,
                        responseType : 'json',
                        transformResponse : function (data){

                            /*
                             * @dateLastData : date des dernières données dans localStorage
                             */
                            var dateLastData = localStorageService.isSupported && localStorageService.get("data-rdv-date") !== null ? localStorageService.get("data-rdv-date") : null;

                            /*
                             * @arrItems : liste de tous les RDV
                             */
                            var arrItems = [];

                            angular.forEach(data, function (item){

                                /*
                                 * @dateJour : date sans l'heure pour le regroupement par dates
                                 */
                                var date = $filter('date')(item.date, "dd/MM/yyyy").split('/');

                                /*
                                 * Convertit la date en timestamp
                                 */
                                var timestamp = new Date(date[1] + '/' + date[0] + '/' + date[2]).getTime();

                                /*
                                 * Ajoute l'élément dateJour à l'objet
                                 */
                                item.dateJour = timestamp;

                                /*
                                 * A FAIRE :
                                 * Ajoute la date prévisionnelle de remboursement
                                 * + 5 jours
                                 */
                                if( item.etat === false ){

                                    item.date = new Date().getTime();
                                }

                                item.datePrevisionnelle = item.date + (1000*60*60*24*5);

                                /*
                                 * Ajoute l'item dans le tableau des RDV
                                 */
                                arrItems.push(item);

                                /*
                                 * Envoi une notification si :
                                 * 1 - les notifications sont activées
                                 * 2 - la date des dernières données est connue
                                 * 3 - la date de remboursement est supérieur à la date des dernières données
                                 * 4 - le remboursement SS a été effectué
                                 * 5 - la notification n'a pas encore été envoyée
                                 */
                                if(Notification.isNotification() === true
                                    && dateLastData !== null
                                    && item.remboursement.date > dateLastData
                                    && item.etat === true
                                    && item.notification === false){

                                    Notification.send({
                                        id : item.id,
                                        titre : 'Nouveau remboursement',
                                        body : "Vous avez reçu un remboursement le " + $filter('date')(item.remboursement.date, 'dd/MM/yyyy') + " d'un montant de " + item.remboursement.montant + "€.",
                                        icon : item.beneficiaire.avatar
                                    });
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
             * Récupère le détail d'un RDV
             *
             * @params : ATTENTION : il faut passer un objet {} pour récupérer tous les paramètres
             */
            getRdvDetail : function (params){

                /*
                 * @data : tous les RDV
                 * @result : détail d'un RDV
                 */
                var data, result = null;

                data = request.isData() === true ? localStorageService.get("data-rdv") : request.getRdvList(params);

                /*
                 * On parcoure l'objet à la recherche du RDV
                 */
                angular.forEach(data, function (item){

                    if(item.id === parseInt($routeParams.id, 0)){

                        result = item;
                    }
                });

                return result;
            },
            /*
             * Supprimer un RDV
             */
            deleteRdv : function (){

                var data = request.isData() === true ? localStorageService.get("data-rdv") : request.getRdvList();

                /*
                 * Nouvel objet qui contient les RDV
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
             * Mise à jour d'un RDV
             */
            updateRdv : function (params){

                var data = request.isData() === true ? localStorageService.get("data-rdv") : request.getRdvList();

                /*
                 * Nouvel objet qui contient les RDV
                 */
                var arrData = [];

                angular.forEach(data, function (item){

                    if(item.id === parseInt($routeParams.id)){

                        angular.forEach(params, function (value, param){

                            /*
                             * Met à jour l'élément du RDV avec la nouvelle valeur
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
             *
             * @params : {
             *  nir : numéro SS
             *	password : mot de passe Ameli
             *	}
             *
             *	A FAIRE :
             */
            loginUser : function (params){

                if(localStorageService.isSupported){

                    localStorageService.set("user", params.nir);
                }

                return true;
            },
            /*
             * Retourne le NIR de l'utilisateur courant depuis localStorage
             */
            getUser : function (){

                if(localStorageService.isSupported){

                    if(localStorageService.get("user") !== null){

                        return localStorageService.get("user");
                    }else{

                        return false;
                    }
                }

                return false;
            },
            /*
             * Est-ce la première visite ?
             */
            isFirstVisit : function (){

                if(localStorageService.isSupported){

                    if(localStorageService.get("is-first-visit") !== null){

                        return false;
                    }else{

                        localStorageService.set("is-first-visit", false);

                        return true;
                    }
                }

                return true;
            },
            /*
             * Réinitialise l'application
             * Vide toutes les données de localStorage et DATA
             */
            clearCache : function (){

                if(localStorageService.isSupported){

                    localStorageService.clearAll();
                }

                DATA = [];

                DATA_DATE = null;

                return true;
            }
        };

        return request;
    }]);