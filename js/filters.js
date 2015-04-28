/*
 * Regrouper les filtres dans ce fichier
 */

/*
 * formaZero : ce filtre permet de définier le format d'un nombre. Il permet de
 * forcer un nombre sur 2 caractères par ex. en ajoutant des zéros
 */
Filters.filter('formatZero', function (){

    return function (n, longueur){

        var number = parseInt(n, 10);

        longueur = parseInt(longueur, 10);

        if(isNaN(number) || isNaN(longueur)){

            return n;
        }

        number = '' + number;

        while(number.length < longueur){

            number = '0' + number;
        }

        return number;
    };
});