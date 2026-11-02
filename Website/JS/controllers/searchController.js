angular.module('homeInnApp').controller('SearchController', ['$scope', 'PropertyService', function($scope, PropertyService) {
    $scope.properties = [];
    $scope.loading = true;
    $scope.searchText = '';
    $scope.selectedType = '';
    $scope.maxPrice = 25000;

    PropertyService.getAllProperties().then(
        function(response) {
            var data = response.data || response;
            $scope.properties = data;
            $scope.loading = false;
        },
        function(error) {
            console.error('Error fetching properties from database:', error);
            $scope.properties = [];
            $scope.loading = false;
        }
    );

    $scope.matchFilter = function(property) {
        if (!property) return false;

        if ($scope.selectedType && property.type !== $scope.selectedType) {
            return false;
        }
        if ($scope.maxPrice && Number(property.rent) > Number($scope.maxPrice)) {
            return false;
        }
        return true;
    };
}]);