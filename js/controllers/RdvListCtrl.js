/*
 * ListCtrl : Liste tous les évènements (RDV, campagne de communication etc...)
 */
Controllers.controller('RdvListCtrl', ['$scope', '$http', '$filter',
    function ($scope, $http, $filter){

        /*
         * Récupère les données depuis l'API
         */
        $http.get('datas/data.json').success(function (data){

            /*
             * On crée ce tableau pour y ajouter des données manipulées
             */
            var arrItems = [];

            angular.forEach(data, function (item){

                /*
                 *  @titre :
                 *   - Prenom Nom du PS
                 *   - Raison sociale de l'établissement
                 *
                 *  @type :
                 *   - rdv : rdv pris par l'utilisateur
                 *
                 *  @etat :
                 *   - true : remboursé
                 *   - false : non remboursé
                 */
                arrItems.push({
                    "id" : item.id,
                    "date" : item.date,
                    "titre" : item.titre,
                    "numero" : item.numero,
                    "adresse" : item.adresse,
                    "telephone" : item.telephone,
                    "type" : item.type,
                    "etat" : item.etat,
                    "dateJMA" : $filter('date')(item.date, "dd/MM/yyyy"),
                    "notes" : item.notes,
                    "remboursement" : item.remboursement,
                    "beneficiaire" : item.beneficiaire
                });
            });

            /*
             * @items : objet qui contient tous les évènements + les données insérés par calculs
             */
            $scope.items = arrItems;
        });

        /*
         * Menu qui permet de filtrer rapidement les évènements. Charge {{query}}.
         */
        $scope.menus = [
            {
                "titre" : "Tout",
                "url" : "#/rdv-list",
                "image" : "img/menu.svg",
                "query" : this
            },
            {
                "titre" : "En attente",
                "url" : "#/rdv-list",
                "image" : "img/schedule-orange.svg",
                "query" : false
            },
            {
                "titre" : "Terminés",
                "url" : "#/rdv-list",
                "image" : "img/check-green.svg",
                "query" : true
            }
        ];

        /*
         * @selectedIndex : Element selectionné par défaut
         */
        $scope.selectedIndex = 0;

        /*
         * selectItem(index) : Quand on clique sur un élement du menu. Met à jour la requête {{query}}
         */
        $scope.selectItem = function (index){

            $scope.selectedIndex = index;

            /*
             * Met à jour le filtre
             */
            $scope.query = $scope.menus[$scope.selectedIndex].query;
        };

        /*
         * createEvenement() : créer un nouvel évènement.
         */
        $scope.createEvenement = function (){

            console.log("createEvenement", this);
        };
    }]);
