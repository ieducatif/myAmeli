/*
 * DetailCtrl : affiche la carte détaillée de l'évènement selectionné
 */
Controllers.controller('RdvDetailCtrl', ['$scope', '$routeParams', '$http',
    function ($scope, $routeParams, $http){

        console.log($routeParams.id);

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
        };

        /*
         * archiveEvenement() : archiver un évènement.
         */
        $scope.archiveEvenement = function (){

            console.log("archiveEvenement", $scope.item);
        };

        /*
         * deleteEvenement() : supprimer un évènement.
         */
        $scope.deleteEvenement = function (){

            console.log("deleteEvenement", $scope.item);
        };

    }]);
