
angular.module('contestControllers').controller('CompanyCapitalizeFixOilController', ['$scope', '$resource', 'MenuItem', function ($scope, $resource, MenuItem) {

	MenuItem.setKey(5);

	$scope.pageWidth = '';

	$scope.companies = (function(){
		var res = $resource('http://test.iliushin.com:8081/api/analyse?query=exec dbo.[spt_GetQualifiedCompanies]');
		var arr = [];
		res.query({},function(data){
			angular.forEach(data, function(value){
				arr.push({label: value.companyName, value: value.companyName});
			});
		});
		return arr;
	})();


	$scope.title = 'Влияние курса доллара на капитализацию компании при неизменности других факторов. Цена нефти соответствует исторической.';
	$scope.dataResource = $resource('http://test.iliushin.com:8081/api/analyse?query=exec dbo.spt_AnalyzeDollarRelation :start, :step, :end, \':companyName\'');				

	$scope.chartHeight = window.innerHeight - 360;



    $scope.chartOptions = {
		responsive: true,
		scaleShowGridLines : true,
		scaleGridLineColor : "rgba(0,0,0,.05)",
		scaleGridLineWidth : 1,
		bezierCurve : true,
		bezierCurveTension : 0.4,
		pointDot : true,
		pointDotRadius : 4,
		pointDotStrokeWidth : 1,
		pointHitDetectionRadius : 20,
		datasetStroke : true,
		datasetStrokeWidth : 2,
		datasetFill : false,
		maintainAspectRatio: false,
		multiTooltipTemplate: "<%if (value != 0){%><%=value%> <%}%>",
		onAnimationProgress: function(){},
		onAnimationComplete: function(){},
		legendTemplate : '<div class="legend-container"><ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul></div>'
    };

    $scope.getDateString = function(date) {
    	var day = Math.floor(date.getDate()/10)==0? '0'+date.getDate():date.getDate();
    	var month = Math.floor((date.getMonth()+1)/10)==0? '0'+(date.getMonth()+1):(date.getMonth()+1);
    	return day+'-'+month+'-'+date.getFullYear();
    }

	$scope.getData = function() {
		if ($scope.step && $scope.dollarStart && $scope.dollarEnd && $scope.curComp) {
			var datasetY = [];
			var datasetCap = [];
			var datasetStock = [];
			var intervals = Math.floor(Math.abs(($scope.dollarEnd - $scope.dollarStart)/$scope.step));
			if (intervals > 60) {
				$scope.pageWidth = intervals*20 + 'px';
			} else {
				$scope.pageWidth = (window.innerWidth - 300) + 'px';
			}
			if (+$scope.dollarEnd < (+$scope.dollarStart)) {
				$scope.dollarStart = [$scope.dollarEnd, $scope.dollarEnd=$scope.dollarStart][0];
			}
			$scope.dataResource.query({end: $scope.dollarEnd ,start: $scope.dollarStart, step: $scope.step, companyName: $scope.curComp.value})
				.$promise.then(function(data){
					angular.forEach(data, function(value){
						datasetY.push(value.dollarValue);
						datasetCap.push(value.capitalization);
						datasetStock.push(value.avwStockValue)
					});
					if (datasetY.length == 0) {
						alert('Нет данных для отображения');
						return false;
					}
					$scope.chartData  = {
						labels : datasetY,
						datasets : [
						  {
						  	label: 'Cредневзвешенная стоимость акций',
						    fillColor : "rgba(220,220,220,0.5)",
						    strokeColor : "rgba(220,220,220,1)",
						    pointColor : "rgba(220,220,220,1)",
						    pointStrokeColor : "#fff",
						    data : datasetStock
						  },
						  {
						  	label: 'Cуммарная капитализация',
						    fillColor : "rgba(52,73,94,0.5)",
						    strokeColor : "rgba(52,73,94,1)",
						    pointColor : "rgba(52,73,94,1)",
						    pointStrokeColor : "#fff",
						    data : datasetCap
		 				  }
						]
					};
				}).catch(function(){ 
					alert('Произошла ошибка при загрузке данных с сервера, попробуйте выполнить операцию позднее.')
				});
		}	
	}

}]);