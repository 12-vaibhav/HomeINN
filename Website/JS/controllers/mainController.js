angular.module('homeInnApp').controller('MainController', [
    '$scope',
    'PropertyService',
    function($scope, PropertyService) {
        $scope.dashboardStats = {
            activeListings: 3,
            scheduledVisits: 2,
            savedCount: 5
        };

        $scope.userProperties = [
            {
                _id: '1',
                title: 'Scholars Den Hostel',
                type: 'hostel',
                rent: 6000,
                campusProximity: 'Near Bidholi Gate 1'
            },
            {
                _id: '2',
                title: 'Apex 2BHK Student Flat',
                type: 'flat',
                rent: 16000,
                campusProximity: 'Kandoli Campus Road'
            }
        ];

        $scope.deleteProperty = function(id) {
            $scope.userProperties = $scope.userProperties.filter(p => p._id !== id);
            $scope.dashboardStats.activeListings = $scope.userProperties.length;
            alert('Property removed from active dashboard listings.');
        };

        $scope.currentUser = { username: '', loggedIn: false };
        $scope.loginData = { username: '', password: '' };
        
        $scope.login = function() {
            $http.post('/api/login', { username: $scope.loginData.username }).then(function(res) {
                $scope.currentUser = res.data.user;
                alert('Welcome back, ' + $scope.currentUser.username + '!');
            });
        };
        
        $scope.logout = function() {
            $scope.currentUser = { username: '', loggedIn: false };
            alert('Logged out successfully.');
        };
    }
]);