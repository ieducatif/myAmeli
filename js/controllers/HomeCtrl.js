/*
 * HomeCtrl : Page d'accueil
 */
Controllers.controller('HomeCtrl', ['$scope', '$window', 'Data',
    function ($scope, $window, Data){

        /*
         * Valeurs par défaut
         */
        $scope.nir = '1820375114001';
        $scope.password = 'test';

        /*
         * submit() : Quand l'utilisateur a saisi son NIR + mot de passe
         * Si ok, rediriger vers la liste des RDV
         */
        $scope.submit = function (){

            /*
             * Authentifie l'utilisateur via le service Data
             * Retourne true si la combinaison est correcte sinon false
             */
            var login = Data.loginUser({
                nir : $scope.nir,
                password : $scope.password
            });

            if(login === true){

                /*
                 * Redirection vers la liste des RDV
                 */
                $window.location.hash = '#rdv-list/';

                return;
            }
        };
    }]);