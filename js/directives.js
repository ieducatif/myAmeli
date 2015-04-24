/*
 * Directives
 */

/*
 * onScrollTop($document) : Cache/affiche .brand lors du scroll de la page
 */
app.directive("onScrollTop", function ($document){

    return function (scope, element, attrs){

        var onScroll = function (){

            scope.$apply(function (){

                if($document.scrollTop() > 0){

                    element.hide();
                }else{

                    element.show();
                }
            });
        };

        /*
         * Listener
         */
        $document.bind('scroll', onScroll);

        /*
         * Quand on perd le scope, on supprime le listener
         */
        scope.$on('$destroy', function (){

            $document.unbind('scroll', onScroll);
        });
    };
});

/*
 * popup : Affiche une popup
 *
 * Utilsation :
 * - Dans la vue : ajouter <popup></popup>
 * - Dans le controller : $scope.popUrl = 'views/popups/nom-de-la-popup.html';
 */
app.directive('popup', function (){

    return {
        restrict : 'E',
        translude : true,
        template : '<div ng-include="popUrl"></div>'
    };
});