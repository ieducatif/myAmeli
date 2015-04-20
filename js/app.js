/*
 * Application : définit l'application et charge les modules d'AngularJS qui seront utilisés
 */
var app = angular.module('app', ['ngRoute', 'ngAnimate', 'Controllers', 'Filters', 'Services', 'angular.filter', 'ngMap']);

/*
 * Routeur : en fonction de l'URL, appelle la vue et charge le controller associé
 */
app.config(['$routeProvider', function ($routeProvider){

        $routeProvider.
            when('/rdv-list', {
                templateUrl : 'views/rdv-list.html',
                controller : 'RdvListCtrl'
            }).
            when('/rdv-detail/:id', {
                templateUrl : 'views/rdv-detail.html',
                controller : 'RdvDetailCtrl'
            }).
            when('/ps-search', {
                templateUrl : 'views/ps-search.html',
                controller : 'PsSearchCtrl'
            }).
            when('/settings', {
                templateUrl : 'views/settings.html',
                controller : 'SettingsCtrl'
            }).
            otherwise({
                redirectTo : '/rdv-list'
            });
    }]);

/*
 * Controllers : gèrent les vues.
 */
var Controllers = angular.module('Controllers', []);

/*
 * Services : services personalisés
 */
var Services = angular.module('Services', ['ngResource']);

/*
 * Filters : filtres personnalisées
 */
var Filters = angular.module('Filters', []);