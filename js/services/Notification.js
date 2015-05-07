/*
 * Notification : ce service gèrent les notifications
 */
Services.factory('Notification', ['$resource', '$filter', 'localStorageService', '$window', '$log',
    function ($resource, $filter, localStorageService, $window, $log){

        var notification = {
            /*
             * Vérifie si la fonctionnalité Notification est supportée par le navigateur et l'OS
             * et si l'utilisateur a activé la fonctionnalité dans les paramètres de l'application
             */
            isNotification : function (){

                var status = false;

                /*
                 * Attention : ne semble pas fonctionner sur tous les smartphones
                 * Testé sur Android et iOS
                 */
                var isMobile = navigator.userAgent.toLowerCase().match(/android|iphone|ipad|ipod/i);

                /*
                 * A FAIRE :
                 */
                if(isMobile){

                    $log.warn("isMobile : " + isMobile);

                    return false;
                }

                if(typeof window.Notification !== 'undefined'){

                    status = true;

                    if(localStorageService.isSupported){

                        /*
                         * Vérifie si les notifications sont activées
                         */
                        if(localStorageService.get('notifications') === "false"){

                            status = false;
                        }
                    }
                }

                return status;
            },
            /*
             * Permet d'activer/désactiver les notifications
             */
            switch : function (){

                var status = false;

                if(localStorageService.isSupported){

                    if(localStorageService.get("notifications") === null || localStorageService.get("notifications") === "true"){

                        localStorageService.set("notifications", false);

                        status = false;

                    }else{

                        localStorageService.set("notifications", true);

                        status = true;
                    }
                }

                return status;
            },
            /*
             * Envoi une notification
             *
             * @params  = {
             *      titre : titre de la notification
             *      body : message
             *      icon : url vers une image
             *	}
             */
            send : function (params){

                if(notification.isNotification() === true){

                    /*
                     * @instance : nouvelle notification
                     */
                    var instance = null;

                    if(Notification.permission === "granted"){

                        /*
                         * Charge et envoie la notification
                         */
                        instance = new Notification(
                            params.titre, {
                                body : params.body,
                                icon : params.icon
                            }
                        );

                    }else{

                        /*
                         * Demande l'autorisation à l'utilisateur
                         */
                        Notification.requestPermission(function (permission){

                            if(permission === "granted"){

                                /*
                                 * Charge et envoie la notification
                                 */
                                instance = new Notification(
                                    params.titre, {
                                        body : params.body,
                                        icon : params.icon
                                    }
                                );
                            }
                        });
                    }

                    /*
                     * Actions sur la notification
                     */
                    instance.onclick = function (id){

                        /*
                         * Redirection vers la page du détail du RDV
                         */
                        if(params.test !== true){

                            $window.location.hash = '#/rdv-detail/' + params.id;
                        }
                    };

                    instance.onshow = function (){

                        /*
                         * Masquer les notifications après un délai de 5 secondes
                         */
                        setTimeout(instance.close.bind(instance), 5000);
                    };

                    instance.onclose = function (id){
                        /*
                         * Ne rien faire
                         */
                    };

                    instance.onerror = function (){

                        $log.warn('Erreur sur la notification');
                    };
                }
            }
        };

        return notification;
    }]);