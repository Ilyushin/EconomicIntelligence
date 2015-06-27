angular.module('contestControllers').controller('ManufacturePartController', ['$scope', '$resource', 'MenuItem', function ($scope, $resource, MenuItem) {

	MenuItem.setKey(8);


	$scope.title = 'Доли отраслей в капитализации рынка за период.';
	$scope.dataResource = $resource('http://test.iliushin.com:8081/api/analyse?query=exec dbo.[spt_GetFieldShares] \':date1\',\':date2\'');				

    var getDateString = function(d) {
    	var date = new Date(d);
    	var day = Math.floor(date.getDate()/10)==0? '0'+date.getDate():date.getDate();
    	var month = Math.floor((date.getMonth()+1)/10)==0? '0'+(date.getMonth()+1):(date.getMonth()+1);

    	return day+'/'+month+'/'+date.getFullYear();
    }

    $scope.showTable = false;
    $scope.tableData = [];

	$scope.getTable = function() {
		if ($scope.fromDate && $scope.tillDate) {
			$scope.dataResource.query({th: parseFloat($scope.growSize), date1: getDateString($scope.fromDate), date2: getDateString($scope.tillDate)}).$promise.then(function(data){
				$scope.tableData = data;
				if ($scope.tableData.length == 0) {
				alert('Нет данных для отображения');
	    		$scope.showTable = false;
		    		return false;
				} else {
					$scope.showTable = true;
				}
			}).catch(function(){ 
				alert('Произошла ошибка при загрузке данных с сервера, попробуйте выполнить операцию позднее.')
			});	
		}
	}

}]);