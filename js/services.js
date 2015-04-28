/*
 * Data : ce service gèrent les requêtes REST
 */
Services.factory('Data', ['$resource', '$filter', '$routeParams', 'localStorageService', 'Notification',
    function ($resource, $filter, $routeParams, localStorageService, Notification){

        var request = {
            /*
             * Vérifie si les données sont dans localStorage et sont à jour
             */
            statusStorage : function (){

                var status = false;

                if(localStorageService.isSupported){

                    if(localStorageService.get("data-rdv") !== null && localStorageService.get("data-rdv-date") !== null){

                        status = true;
                    }
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
                if(request.statusStorage() === true  && params.forceUpdate === false){
					
					console.log('Données chargées depuis localStorage. params.forceUpdate = ', params.forceUpdate);

                    return localStorageService.get("data-rdv");
                }
				
				console.log('Données chargées depuis le serveur. params.forceUpdate = ', params.forceUpdate);

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
							var dateLastData = localStorageService.get("data-rdv-date") !== null ? localStorageService.get("data-rdv-date") : null;
							
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
								if (dateLastData !== null) {

									if (item.remboursement.date > dateLastData && item.etat ===true && compteurNotifications < 3) {

										Notification.send({
											id : item.id,
											titre: 'Nouveau remboursement',
											body: "Vous avez reçu un remboursement le " + $filter('date')(item.remboursement.date, 'dd/MM/yyyy') + " d'un montant de " + item.remboursement.montant + "€.",
											icon: item.beneficiaire.avatar
										});

										/*
										 * Incrémente le compteur
										 */
										compteurNotifications++;
									}
								}
                            });

                            /*
                             * On sauvegarde les datas dans localStorage pour optimiser
                             */
                            localStorageService.set("data-rdv", arrItems);

                            /*
                             * On sauvegarde la date de la mise à jour des données
                             */
                            localStorageService.set("data-rdv-date", new Date().getTime());

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

                var data = localStorageService.get("data-rdv");

                /*
                 * Nouvel objet qui contient les évènement
                 */
                var arrData = [];

                angular.forEach(data, function (item){

                    if(item.id !== parseInt($routeParams.id,0)){

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
                 * Mise à jour des donnés dans localStorage
                 */
                localStorageService.set("data-rdv", arrData);
            },
			/*
			* Vérfie le login et mot de passe
			* @params : {
			*		nir : numéro SS
			*		password : mot de passe Ameli
			*	}
			*/
			loginUser : function(params){
				
				return true;
			}
        };

        return request;

    }]);

/*
* Notification : ce service gèrent les notifications
*/
Services.factory('Notification', ['$resource', '$filter', 'localStorageService', '$window',
	function($resource, $filter, localStorageService, $window) {

		var notification = {
			/* 
			 * Envoi une notification
			 *	@params  = {
			 *		titre : titre de la notification
			 *		body : message
			 *		icon : url vers une image
			 *	}
			 */
			send: function(params) {
				
				
				
				/*
				* Ne semble pas fonctionner sur les smartphones
				*/
				var navigateur = navigator.userAgent.toLowerCase();
				
				var isAndroid = navigateur.indexOf("android") > -1;
				
				var isIPhone = navigateur.indexOf("iphone") > -1;
				
				if(isAndroid || isIPhone){
					
					return;
				}
				
				/*
				* @instance : nouvelle notification
				*/
				var instance = null;
				
				/*
				* @wNotification : test si le navigateur supporte Notification
				*/
				
				//var wNotification = window.Notification || window.mozNotification || window.webkitNotification;
				var wNotification = window.Notification;
				
				if ( typeof(wNotification) !== 'undefined' ){
					
					console.log("Notification OK");
					
					if (Notification.permission === "granted") {
						
						/*
						* Charge et envoie la notification
						*/
						instance = new Notification(
							params.titre, {
								body: params.body,
								icon: params.icon
							}
						);

					} else{
						
						/*
						* Demande l'autorisation à l'utilisateur
						*/
						Notification.requestPermission(function(permission) {

							if (permission === "granted") {
								
								/*
								* Charge et envoie la notification
								*/
								instance = new Notification(
									params.titre, {
										body: params.body,
										icon: params.icon
									}
								);
							}
						});
					}
					
					/*
					* Actions sur la notification
					*/
					instance.onclick = function(id){
						
						/*
						* Redirection vers la page du détail du RDV
						*/
						$window.location.hash = '#/rdv-detail/' + params.id;
					};
					
					instance.onshow = function(){
						
						/*
						* Masquer les notifications après un délai de 5 secondes
						*/
						setTimeout(function(){
							/*
							* A FAIRE :
							*/
						}, 5000);
					};
					
					instance.onclose = function(){
						
					};
					
					instance.onerror = function(){
						
						console.log('Erreur : notification');
					};

				} 

			}
		};

		return notification;

	}]);