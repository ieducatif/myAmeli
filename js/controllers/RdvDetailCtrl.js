/*
 * DetailCtrl : affiche la carte détaillée de l'évènement selectionné
 */
Controllers.controller('RdvDetailCtrl', ['$scope', '$window', '$routeParams', 'Data',
    function ($scope, $window, $routeParams, Data){

        /*
         * @$routeParams.id : contient l'id de l'évenement
         */

        /*
         * Récupère le détail de l'évènement depuis le service Data
         */
        $scope.item = Data.getRdvDetail();

        /*
         * Fonctions liées aux boutons de la vue
         */

        /*
         * notesChange() : mise à jour des notes
         */
        $scope.notesChange = function (){

            Data.updateRdv({
                'notes' : $scope.item.notes
            });
        };

        /*
         * duplicateEvenement() : dupliquer un évènement.
         */
        $scope.duplicateEvenement = function (){

            /*
             * Popup de confirmation
             */
            $scope.popUrl = 'views/popups/alert.html';

            /*
             * Personnalisation de la popup
             */
            $scope.popup = {
                "titre" : "Dupliquer",
                "message" : "Voulez-vous dupliquer cet évènement ?",
                "class" : "success",
                "boutons" : {
                    "confirm" : {
                        "titre" : "Oui",
                        "action" : "confirm()"
                    },
                    "cancel" : {
                        "titre" : "Non",
                        "action" : "cancel()"
                    }
                }
            };

            /*
             * L'utilisateur confirme la duplication
             */
            $scope.confirm = function (){

                /*
                 * Appelle la vue ps-search en passant le numéro de PS
                 */
                $window.location.hash = '#/ps-search/' + $scope.item.numero;
            };

            /*
             * L'utilisateur annule l'archivage
             */
            $scope.cancel = function (){

                /*
                 * Vide la vue
                 */
                $scope.popUrl = null;
            };
        };

        /*
         * archiveEvenement() : archiver un évènement.
         */
        $scope.archiveEvenement = function (){

            /*
             * Popup de confirmation
             */
            $scope.popUrl = 'views/popups/alert.html';

            /*
             * Personnalisation de la popup
             */
            $scope.popup = {
                "titre" : "Archiver",
                "message" : "Êtes-vous sûr de vouloir archiver cet évènement ?",
                "class" : "warning",
                "boutons" : {
                    "confirm" : {
                        "titre" : "Oui",
                        "action" : "confirm()"
                    },
                    "cancel" : {
                        "titre" : "Non",
                        "action" : "cancel()"
                    }
                }
            };

            /*
             * L'utilisateur confirme l'archivage
             */
            $scope.confirm = function (){

                /*
                 * Actions :
                 * 1 - Archive l'évènement localStorage
                 * 2 - Archive le rdv sur le serveur
                 * 3 - Rediriger vers la page d'accueil
                 */

                $window.location.hash = '#/';
            };

            /*
             * L'utilisateur annule l'archivage
             */
            $scope.cancel = function (){

                /*
                 * Vide la vue
                 */
                $scope.popUrl = null;
            };
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
                "titre" : "Supprimer",
                "message" : "Êtes-vous sûr de vouloir supprimer cet évènement ?",
                "class" : "danger",
                "boutons" : {
                    "confirm" : {
                        "titre" : "Oui",
                        "action" : "confirm()"
                    },
                    "cancel" : {
                        "titre" : "Non",
                        "action" : "cancel()"
                    }
                }
            };

            /*
             * L'utilisateur confirme la suppression
             */
            $scope.confirm = function (){

                /*
                 * Actions :
                 * 1 - Supprimer le rdv dans localStorage
                 * 2 - Supprimer le rdv sur le serveur
                 * 3 - Rediriger vers la page d'accueil
                 */
                Data.deleteRdv();

                $window.location.hash = '#/';
            };

            /*
             * L'utilisateur annule
             */
            $scope.cancel = function (){

                /*
                 * Vide la vue
                 */
                $scope.popUrl = null;
            };
        };
    }]);
