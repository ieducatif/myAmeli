/*
 * SettingsCtrl : permet de paramétrer l'application (notifications, utilisateurs, avatars)
 */
Controllers.controller('SettingsCtrl', ['$scope', '$window', 'Data', 'Notification',
    function ($scope, $window, Data, Notification){

        /*
         * A FAIRE :
         */

        /*
         * Efface toutes les données stockées dans localStorage
         */
        $scope.clearCache = function (){

            if(Data.clearCache() === true){

                $window.location.hash = '#/home';
            }
        };

        /*
         * Affiche une notification d'exemple
         */
        $scope.simulerNotification = function (){

            Notification.send({
                titre : "Nouveau remboursement",
                body : "Vous avez un remboursement d'un montant de 8,45€",
                icon : "img/avatars/cartman.jpg",
                test : true
            });
        };
    }]);