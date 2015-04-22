/*
 * DetailCtrl : affiche la carte détaillée de l'évènement selectionné
 */
Controllers.controller('RdvDetailCtrl', ['$scope', '$window', '$routeParams', '$http',
    function ($scope, $window, $routeParams, $http){

        /*
         * @$routeParams.id : contient l'id de l'évenement
         */

        /*
         * A FAIRE : récupérer les données depuis localStorage pour éviter de requêter à nouveau
         */
        $http.get('datas/data.json').success(function (data){

            angular.forEach(data, function (item, key){

                if(item.id == $routeParams.id){

                    /*
                     * Charge les données de l'évènement.
                     */
                    $scope.item = data[key];
                    return;
                }
            });
        });
        /*
         * duplicateEvenement() : dupliquer un évènement.
         */
        $scope.duplicateEvenement = function (){

            console.log("duplicateEvenement", $scope.item);
            /*
             * Appelle la vue ps-search en passant le numéro de PS
             */
            $window.location.hash = '#/ps-search/' + $scope.item.numero;
        };
        /*
         * archiveEvenement() : archiver un évènement.
         */
        $scope.archiveEvenement = function (){

            console.log("archiveEvenement", $scope.item);
            /*
             *
             * A FAIRE :
             */

        };

        /*
         * deleteEvenement() : supprimer un évènement.
         */
        $scope.deleteEvenement = function (){

            /*
             * Popup de confirmation
             */
            $scope.popUrl = 'views/popups/alert.html';

            /*
             * Personnalisation de la popup
             */
            $scope.popup = {
                "titre" : "Confirmation",
                "message" : "Êtes-vous sûr de vouloir supprimer cet évènement ?",
                "class" : "danger",
                "boutons" : {
                    "confirm" : {
                        "titre" : "Oui",
                        "action" : "deleteConfirm()"
                    },
                    "cancel" : {
                        "titre" : "Non",
                        "action" : "deleteCancel()"
                    }
                }
            };

            /*
             * L'utilisateur confirme la suppression
             */
            $scope.deleteConfirm = function (){

                alert();

                /*
                 * Appel de la page d'accueil
                 */

                $window.location.hash = '#/rdv-list';
            };

            /*
             * L'utilisateur annule la suppression
             */
            $scope.deleteCancel = function (){

                console.log("cancel");
            };
        };
    }]);
