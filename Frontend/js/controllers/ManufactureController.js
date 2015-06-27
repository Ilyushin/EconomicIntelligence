angular.module('contestControllers').controller('ManufactureController', ['$scope', '$resource', 'MenuItem', function ($scope, $resource, MenuItem) {

	MenuItem.setKey(4);

	var monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

	$scope.pageWidth = '';
	$scope.chartHeight = window.innerHeight - 230;



	$scope.mans = (function(){
		var res = $resource('http://test.iliushin.com:8081/api/analyse?query=select fieldname from dbo.dimFields');
		var arr = [];
		res.query({},function(data){
			angular.forEach(data, function(value){
				arr.push({label: value.fieldname, value: value.fieldname});
			});
		});
		return arr;
	})();

	$scope.title = 'Статистика средневзвешенной стоимости акций по отрасли';
	$scope.dataResource = $resource('http://test.iliushin.com:8081/api/analyse?query=exec spt_GetWeightedStockPriceByField \':curMan\'');				

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
		datasetFill : true,
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
		if ($scope.curMan) {
			var datasetY = [];
			var datasetX = [];

			$scope.pageWidth = '';

			$scope.dataResource.query({curMan: $scope.curMan.value}).$promise.then(function(data){
				angular.forEach(data, function(value){
					datasetY.push(value.valueYear);
					datasetX.push(value.stockValue);
				});
				if (datasetY.length == 0) {
					alert('Нет данных для отображения')
				} else {
					$scope.chartData  = {
						labels : datasetY,
						datasets : [
						  {
						  	label: $scope.curMan.value,
						    fillColor : "rgba(151,187,205,0.5)",
						    strokeColor : "rgba(151,187,205,1)",
						    pointColor : "rgba(151,187,205,1)",
						    pointStrokeColor : "#fff",
						    data : datasetX
						  }
						]
					};
				}
			}).catch(function(){ 
				alert('Произошла ошибка при загрузке данных с сервера, попробуйте выполнить операцию позднее.')
			});
		} else {
			alert('Выберите отрасль');
		}
		
	}

	$scope.showScaleButton = false;

	$scope.minimizeScale = function() {
		if ($scope.showScaleButton){
			$scope.getData();
			$scope.showScaleButton = false;			
		} else {
			alert('Выберите отрасль');
		}
	}

	$scope.yearResource = $resource('http://test.iliushin.com:8081/api/analyse?query=exec spt_GetWeightedStockPriceByFieldYearDetailed \':curMan\',:year');				

	$scope.chartClick = function(event){
		if ($scope.showScaleButton) {
			return false;
		}
		var data = $scope.chart.getPointsAtEvent(event);
		var dSetY = [];
		var dSetX = [];
		$scope.showScaleButton = true;
		$scope.yearResource.query({curMan: $scope.curMan.value, year: data[0].label}, function(data){
			angular.forEach(data, function(value){
				dSetX.push(value.stockValue);
			});
		});
		$scope.chartData  = {
			labels : monthNames,
			datasets : [
			  {
			  	label: $scope.curMan.value,
			    fillColor : "rgba(151,187,205,0.5)",
			    strokeColor : "rgba(151,187,205,1)",
			    pointColor : "rgba(151,187,205,1)",
			    pointStrokeColor : "#fff",
			    data : dSetX
			  }
			]
		};
	}

}]);