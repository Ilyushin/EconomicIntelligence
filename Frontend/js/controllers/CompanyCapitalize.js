
angular.module('contestControllers').controller('CompanyCapitalizeController', ['$scope', '$resource', 'MenuItem', function ($scope, $resource, MenuItem) {

	MenuItem.setKey(2);

	$scope.pageWidth = '';

	$scope.companies = (function(){
		var res = $resource('http://test.iliushin.com:8081/api/analyse?query=exec [spt_GetQualifiedCompanies]');
		var arr = [];
		res.query({},function(data){
			angular.forEach(data, function(value){
				arr.push({label: value.companyName, value: value.companyName});
			});
		});
		return arr;
	})();

	$scope.showTable = false;


	$scope.title = 'Влияние изменений стоимости нефти и курса доллара к рублю на суммарную капитализацию компаний малого и среднего размера (100 - 500 млн руб)';
	$scope.dataResource = $resource('http://test.iliushin.com:8081/api/analyse?query=exec dbo.[spt_AnalyzeDollarOilRelation] :dollarStart, :oilStart, \':companyName\', :dollarEnd, :oilEnd');				

    $scope.tableData = {};

	$scope.getTable = function() {
		if ($scope.oilStart && $scope.oilEnd && $scope.dollarStart && $scope.dollarEnd && $scope.curComp) {
			$scope.dataResource.query({dollarEnd: $scope.dollarEnd ,dollarStart: $scope.dollarStart, oilEnd: $scope.oilEnd, oilStart: $scope.oilStart, companyName: $scope.curComp.value}, function(data){
				$scope.tableData = {
					capitalInc: (data[0].capitalInc * 100).toPrecision(5),
					dollarInc: (data[0].dollarInc * 100).toPrecision(5),
					oilInc: (data[0].oilInc * 100).toPrecision(5),
					stockInc: (data[0].stockInc * 100).toPrecision(5)
				};
			});
			$scope.showTable = true;
		} else {
			$scope.showTable = false;
		}	
	}

}]);