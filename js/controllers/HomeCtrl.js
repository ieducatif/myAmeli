/*
 * HomeCtrl : Page d'accueil
 */
Controllers.controller('HomeCtrl', ['$scope', '$window', 'Data',
    function($scope, $window, Data){
			
		/*
		* A FAIRE : vérifier si l'utilisateur n'est pas déjà loggué
		* Si oui, rediriger vers la liste des RDV /rdv-list
		*/
		
		/*
		* Valeurs par défaut
		*/
		$scope.nir = '1820375114001';
		$scope.password = 'test';
		
		/*
		* submit() : Quand l'utilisateur a saisi sont NIR + mot de passe
		* A FAIRE : vérifier si le NIR et le mot en utilisant le service Data
		* Si ok, stocker l'état dans localStorage et rediriger vers la liste des RDV
		*/
        $scope.submit = function(){
			
			/*
			* Authentifie l'utilisateur via le service Data
			* Retourne true si la combinaison est correcte sinon false
			*/
 			var login = Data.loginUser({
				'nir' : $scope.nir,
				'password' : $scope.password
			});
			
			if( login === true ){
			
				/*
				* Redirection vers la liste des RDV
				*/
				$window.location.hash = '#rdv-list/';
			}
        };
    }]);