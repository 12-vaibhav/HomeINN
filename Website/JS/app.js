var app = angular.module('homeInnApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'SearchController'
        })
        .when('/listings', {
            templateUrl: 'views/listings.html',
            controller: 'SearchController'
        })
        .when('/property/:id', {
            templateUrl: 'views/property-detail.html',
            controller: 'DetailController'
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'MainController'
        })

        .when('/add-property', {
            templateUrl: 'views/add-property.html',
            controller: 'AddController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);