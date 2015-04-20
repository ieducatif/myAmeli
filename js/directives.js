/*
 * Directives
 *
 * A FAIRE : Regrouper toutes les directives dans ce fichier
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