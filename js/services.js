/*
 * Data : ce service gèrent les requêtes REST
 */
Services.factory('Data', ['$resource', '$filter', '$routeParams', 'localStorageService',
    function ($resource, $filter, $routeParams, localStorageService){

        var request = {
            /*
             * Vérfie si les données sont dans localStorage et sont à jour
             */
            statusStorage : function (){

                var status = false;

                if(localStorageService.isSupported){

                    if(localStorageService.get("data-rdv") !== null){

                        status = true;
                    }
                }

                return status;
            },
            /*
             * Récupère la liste de tous les évènements pour un assuré et ses bénéficiaires
             * A FAIRE : passer les paramètres
             */
            getRdvList : function (){

                /*
                 * Depuis localStorage
                 */
                if(request.statusStorage() === true){

                    return localStorageService.get("data-rdv");
                }

                /*
                 * Depuis REST
                 */
                var resource = $resource('datas/data.json', {}, {
                    query : {
                        method : 'GET',
                        params : {},
                        isArray : true,
                        responseType : 'json',
                        transformResponse : function (data){

                            /*
                             * @arrItems : liste de tous les évènements
                             */
                            var arrItems = [];

                            angular.forEach(data, function (item){

                                /*
                                 * Ajoute la date sans l'heure pour le regroupement par date
                                 */
                                var date = $filter('date')(item.date, "dd/MM/yyyy").split('/');

                                var timestamp = new Date(date[1] + '/' + date[0] + '/' + date[2]).getTime();

                                item.dateJour = timestamp;

                                /*
                                 * Ajoute l'item dans le tableau des RDV
                                 */
                                arrItems.push(item);
                            });

                            /*
                             * On sauvegarde les datas dans localStorage pour optimiser
                             */
                            localStorageService.set("data-rdv", arrItems);

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

                data = request.statusStorage() === true ? localStorageService.get("data-rdv") : request.getRdvList();

                /*
                 * On parcoure l'objet à la recherche de notre évènement
                 */
                angular.forEach(data, function (item){

                    if(item.id == $routeParams.id){

                        result = item;
                    }
                });

                return result;
            },
            /*
             * Supprimer un évènement
             */
            deleteRdv : function (){

                var data = localStorageService.get("data-rdv");

                /*
                 * Nouvel objet qui contient les évènement
                 */
                var arrData = [];

                angular.forEach(data, function (item){

                    if(item.id != $routeParams.id){

                        arrData.push(item);
                    }
                });

                /*
                 * Mise à jour des donnés dans localStorage
                 */
                localStorageService.set("data-rdv", arrData);
            },
            /*
             * Mise à jour d'un évènement
             */
            updateRdv : function (params){

                var data = localStorageService.get("data-rdv");

                /*
                 * Nouvel objet qui contient les évènement
                 */
                var arrData = [];

                angular.forEach(data, function (item){

                    if(item.id == $routeParams.id){

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
                 * Mise à jour des donnés dans localStorage
                 */
                localStorageService.set("data-rdv", arrData);
            }
        };

        return request;

    }]);