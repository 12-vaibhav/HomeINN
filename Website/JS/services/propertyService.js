angular.module('homeInnApp').factory('PropertyService', ['$http', function($http) {
    return {
        getAllProperties: function() {
            return $http.get('/api/properties');
        },
        getPropertyById: function(id) {
            return $http.get('/api/properties/' + id);
        },
        addProperty: function(propertyData) {
            return $http.post('/api/properties', propertyData);
        }
    };
}]);

