/*
 * Tutoriel : Présentation des fonctionnalités
 */
Controllers.controller('TutorielCtrl', ['$scope', '$window', '$log',
    function ($scope, $window, $log){

        $scope.items = [
            {
                id : 1,
                titre : "Bienvenue",
                message : "Gérez vos rendez-vous médicaux et vos remboursements de l'Assurance Maladie au même endroit.",
                bouton : {
                    titre : 'Suivant',
                    href : '#/tutoriel'
                }
            },
            {
                id : 2,
                titre : "RDV médicaux",
                message : "Recherchez, contactez et prenez RDV auprès des professionnels de santé et des établissements de santé de la France entière.",
                bouton : {
                    titre : 'Suivant',
                    href : '#/tutoriel'
                }
            }, {
                id : 3,
                titre : "Remboursements",
                message : "Soyez notifié de l'arrivée d'un remboursement en temps réel et ne perdez plus de temps à vérifier.",
                bouton : {
                    titre : 'Suivant',
                    href : '#/tutoriel'
                }
            }, {
                id : 4,
                titre : "Toute la famille",
                message : "Ces fonctionnalités s'appliquent à tous vos bénéficiaires.",
                bouton : {
                    titre : 'On y va !',
                    href : '#/ps-search'
                }
            }
        ];

        /*
         * @etape
         */
        $scope.etape = 1;

        /*
         * suivant() : passe au panneau du tutoriel suivant
         * Une fois le tutoriel fini on redirige vers ps-search
         */
        $scope.suivant = function (){

            $scope.etape++;
        };

    }]);