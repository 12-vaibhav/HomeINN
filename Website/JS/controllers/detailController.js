angular.module('homeInnApp').controller('DetailController', ['$scope', '$routeParams', 'PropertyService', function($scope, $routeParams, PropertyService) {
    $scope.property = null;
    $scope.isloading = true;

    var propertyId = $routeParams.id;

    // Fetching property by ID from backend (with sample fallback)
    PropertyService.getPropertyById(propertyId).then(
        function(response) {
            $scope.property = response.data || response;
            $scope.isLoading = false;
            renderD3Chart($scope.property.rent || 8000);
        },
        function(error) {
            // Sample data fallback if offline
            var sampleProperties = {
                '1': {_id: '1', title: 'Scholars Den Hostel', type: 'hostel', rent: 6000, campusProximity: 'Near Bidholi Gate 1', amenities: ['Wi-Fi', 'Mess', 'Power Backup'], ownerName: 'Mr. Sharma', contactNumber: '+91 98111 22334'},
                '2': {_id: '2', title: 'Apex 2BHK Student Flat', type: 'flat', rent: 16000, campusProximity: 'Kandoli Campus Road', amenities: ['Furnished', 'Kitchen', 'AC'], ownerName: 'Mrs. Gupta', contactNumber: '+91 98222 33445'}
            };
            $scope.property = sampleProperties[propertyId] || sampleProperties['1'];
            $scope.isLoading = false;
            renderD3Chart($scope.property.rent);
        }
    );

    // Form submission action & Contact actions
    $scope.contactLandlord = function() {
        alert('Landlord Contact: +91 9876543210 (HomeINN Verified)');
    };

    $scope.bookVisit = function() {
        alert('Visit request submitted! The owner will reach out shortly.');
    };

    // D3.js Dynamic bar chart renderer
    function renderD3Chart(basRent) {
        d3.select("#d3-cost-chart").select("svg").remove(); // Clear previous

        var data = [
            {category: 'Base Rent', cost: basRent},
            {category: 'Approx. Mess', cost: 3500},
            {category: 'Electricity', cost: 800},
            {category: 'Maintenance', cost: 500}
        ];

        var width = 350, height = 220;
        var margin = {top: 20, right: 20, bottom: 30, left: 60};

        var svg = d3.select("#d3-cost-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand()
            .range([0, width - margin.left - margin.right])
            .domain(data.map(function(d) {return d.category;}))
            .padding(0.2);

        var y = d3.scaleLinear()
            .range([height - margin.top - margin.bottom, 0])
            .domain([0, d3.max(data, function(d) {return d.cost;}) * 1.2]);

        // X Axis
        svg.append("g")
            .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-15)")
            .style("text-anchor", "end")
            .style("font-size", "10px");

        // Y Axis
        svg.append("g")
            .call(d3.axisLeft(y).ticks(4));

        // Bars
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {return x(d.category);})
            .attr("y", function(d) {return y(d.cost);})
            .attr("width", x.bandwidth())
            .attr("height", function(d) {return (height - margin.top - margin.bottom) - y(d.cost);})
            .attr("fill", "#ffc107");  // Bootstrap warning yellow
    }
}]);