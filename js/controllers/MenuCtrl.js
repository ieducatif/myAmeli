/*
 * MenuCtrl : barre de navigation principale
 */
Controllers.controller('MenuCtrl', ['$scope',
    function ($scope){

        /*
         * @brand : nom de l'application / marque
         */
        $scope.brand = 'myAmeli';

        /*
         * @items : contient les éléments du menu
         */
        $scope.items = [
            {
                "titre" : "Liste des RDV",
                "url" : "#/rdv-list",
                "image" : "img/menu-white.svg"
            },
            {
                "titre" : "Rechercher un PS",
                "url" : "#/ps-search",
                "image" : "img/search-white.svg"
            },
            {
                "titre" : "Paramètres",
                "url" : "#/settings",
                "image" : "img/settings-white.svg"
            }
        ];

        /*
         * @selectedIndex : Element selectionné par défaut.
         */
        $scope.selectedIndex = 0;

        /*
         * selectItem(index) : appelée quand on clique sur un élement du menu.
         */
        $scope.selectItem = function (index){

            $scope.selectedIndex = index;
        };

    }]);