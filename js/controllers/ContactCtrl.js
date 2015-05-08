/*
 * ContactCtrl : Page de contact
 */
Controllers.controller('ContactCtrl', ['$scope', '$log', '$window', '$routeParams', '$filter', 'Data',
    function ($scope, $log, $window, $routeParams, $filter, Data){

        /*
         * Récupère le détail de l'évènement depuis le service Data
         * et charge le scope
         */
        $scope.item = Data.getRdvDetail([{
                forceUpdate : false
            }]);

        /*
         * Récupère le nir depuis le service Data
         */
        $scope.item.nir = Data.getUser();

        /*
         * submit() : lors de l'envoi du formulaire
         */
        $scope.submit = function (){

            /*
             * Vérifie que le message n'est pas vide
             */
            if($scope.message){

                $scope.message = '';
            }

            /*
             * Message
             */
            $scope.popUrl = 'views/popups/alert.html';

            /*
             * Personnalisation de la popup
             */
            $scope.popup = {
                "titre" : "Message envoyé",
                "message" : "Le message a été envoyé à votre caisse d'Assurance Maladie. Un technicien va prendre en charge votre demande et vous répondra dans un délai de 48 heures.",
                "class" : "alert",
                "boutons" : {
                    "confirm" : {
                        "titre" : "Cool !",
                        "action" : "confirm()"
                    },
                    "cancel" : {
                        "titre" : "Annuler",
                        "action" : "cancel()"
                    }
                }
            };

            $scope.confirm = function (){

                /*
                 * Appelle la vue par défaut
                 */
                $window.location.hash = '#/rdv-list/';
            };

            $scope.cancel = function (){

                /*
                 * Vide la vue
                 */
                $scope.popUrl = null;
            };

        };

        /*
         * Cet objet permet de remplir le tableau des références qui seront jointes au message
         */
        $scope.references = [
            {
                libelle : "Mon numéro",
                value : $scope.item.nir
            },
            {
                libelle : "Bénéficiaire",
                value : $scope.item.beneficiaire.prenom + ' ' + $scope.item.beneficiaire.nom
            },
            {
                libelle : "Date de naissance",
                value : $filter('date')($scope.item.beneficiaire.dateNaissance, 'dd/MM/yyyy')
            },
            {
                libelle : "N° du PS",
                value : $scope.item.numero
            },
            {
                libelle : "Date de la prestation",
                value : $filter('date')($scope.item.date, "dd/MM/yyyy")
            },
            {
                libelle : "Montant payé",
                value : $scope.item.montant | 50
            }
        ];
    }]);


