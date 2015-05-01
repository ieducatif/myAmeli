/*
 * Notification : ce service gèrent les notifications
 */
Services.factory('Notification', ['$resource', '$filter', 'localStorageService', '$window', '$log',
    function ($resource, $filter, localStorageService, $window, $log){

        var notification = {
            /*
             * Envoi une notification
             *	@params  = {
             *		titre : titre de la notification
             *		body : message
             *		icon : url vers une image
             *	}
             */
            send : function (params){

                /*
                 * Ne semble pas fonctionner sur les smartphones
                 */
                var navigateur = navigator.userAgent.toLowerCase();

                var isAndroid = navigateur.indexOf("android") > -1;

                var isIPhone = navigateur.indexOf("iphone") > -1;

                //if(isAndroid || isIPhone){
                if(isIPhone){

                    $log.warn("Smartphone : " + navigateur);

                    return;
                }

                /*
                 * @wNotification : test si le navigateur supporte Notification
                 */

                //var wNotification = window.Notification || window.mozNotification || window.webkitNotification;
                var wNotification = window.Notification;

                if(typeof wNotification !== 'undefined'){

                    $log.info("Notification pris en charge");

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
                        $window.location.hash = '#/rdv-detail/' + params.id;
                    };

                    instance.onshow = function (){

                        $log.log(this);

                        /*
                         * Masquer les notifications après un délai de 5 secondes
                         */
                        setTimeout(function (){
                            /*
                             * A FAIRE :
                             */
                        }, 2000);
                    };

                    instance.onclose = function (){

                    };

                    instance.onerror = function (){

                        $log.warn('Erreur sur la notification');
                    };

                }

            }
        };

        return notification;

    }]);