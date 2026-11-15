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

        .when('/login', {
            templateUrl: 'views/add-property.html',
            controller: 'AddController'
        })

        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'AuthController'
        })

        .otherwise({
            redirectTo: '/'
        });
}]);

// Global Main Controller to check session status across views
app.controller('MainController', ['$scope', '$http', function($scope, $http) {
    $scope.currentUser = {loggedIn: false};

    // Check active session on load
    $http.get('/api/session').then(function(response) {
        if (response.data.loggedIn) {
            $scope.currentUser = response.data.user;
        }
    });

    $scope.logout = function() {
        $http.post('/api/logout').then(function(response) {
            $scope.currentUser = {loggedIn: false};
            window.location.href = '#!/';
            window.location.reload();
        });
    };
}]);

// Authetication Controller for the animated Login/Register view
app.controller('AuthController', ['$scope', '$http', function($scope, $http) {
    $scope.isLogin = true;
    $scope.loading = false;
    $scope.statusMessage = '';
    $scope.isError = false;

    $scope.loginData = {};
    $scope.registerData = {role: 'student'};

    $scope.switchTab = function(loginTab) {
        $scope.isLogin = loginTab;
        $scope.statusMessage = '';
    };

    // Handle Login submission
    $scope.handleLogin = function(form) {
        if (form.$invalid) return;
        $scope.loading = true;
        $scope.statusMessage = '';

        $http.post('/api/login', $scope.loginData)
            .then(function(response) {
                $scope.isloading = false;
                $scope.isError = false;
                $scope.statusMessage = 'Login successful! Redirecting...';
                setTimeout(function() {
                    window.location.href = '#!/';
                    window.location.reload();
                }, 800);
            })
            .catch(function(err) {
                $scope.loading = false;
                $scope.isError = true;
                $scope.statusMessage = (err.data && err.data.message) ? err.data.message : 'Invalid email or password.';
            });
    };

    // Handle Registration submission
    $scope.handleRegister = function(form) {
        if (form.$invalid) return;
        $scope.loading = true;
        $scope.statusMessage = '';

        $http.post('/api/register', $scope.registerData)
            .then(function(response) {
                $scope.loading = false;
                $scope.isError = false;
                $scope.statusMessage = 'Account created successfully! Please sign in.';
                $scope.registerData = {role: 'student'};
                $scope.switchTab(true);   //  Switch to login tab
            })
            .catch(function(err) {
                $scope.loading = false;
                $scope.isError = true;
                $scope.statusMessage = (err.data && err.data.message) ? err.data.message : 'Registration failed. Email may already be registered.';
            });
    };
}]);