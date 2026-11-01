angular.module('homeInnApp').controller('SearchController', ['$scope', 'PropertyService', function($scope, PropertyService) {
    $scope.properties = [];
    $scope.loading = true;
    $scope.searchText = '';
    $scope.selectedType = '';
    $scope.maxPrice = 25000;

    var sampleListings = [
        {
            _id: '1',
            title: 'Scholars Den Hostel',
            type: 'hostel',
            rent: 6000,
            campusProximity: 'Near Bidholi Gate 1',
            rating: 4.6,
            amenities: ['Wi-Fi', 'Mess', 'Power Backup']
        },
        {
            _id: '2',
            title: 'Apex 2BHK Student Flat',
            type: 'flat',
            rent: 16000,
            campusProximity: 'Kandoli Campus Road',
            rating: 4.8,
            amenities: ['Furnished', 'Kitchen', 'AC']
        },
        {
            _id: '3',
            title: 'University Heights Single Room',
            type: 'house',
            rent: 9000,
            campusProximity: 'Near UPES Library',
            rating: 4.3,
            amenities: ['Attached Washroom', 'Laundry']
        }
    ];

    PropertyService.getAllProperties().then(
        function(response) {
            var data = response.data || response;
            $scope.properties = (data && data.length > 0) ? data : sampleListings;
            $scope.loading = false;
        },
        function(error) {
            $scope.properties = sampleListings;
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