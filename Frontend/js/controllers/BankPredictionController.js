
angular.module('contestControllers').controller('BankPredictionController', ['$scope', '$resource', 'MenuItem', function ($scope, $resource, MenuItem) {

	MenuItem.setKey(1);

	$scope.pageWidth = '';

	$scope.banks = (function(){
		var res = $resource('http://test.iliushin.com:8081/api/analyse?query=exec [spt_GetQualifiedMinFinBanks]');
		var arr = [];
		res.query({},function(data){
			angular.forEach(data, function(value){
				arr.push({label: value.companyName, value: value.companyName});
			});
		});
		return arr;
	})();


	$scope.title = 'Активы банка';
	$scope.dataResource = $resource('http://test.iliushin.com:8081/api/analyse?query=exec dbo.spt_PredictTimeSeries_BanksAll \':bankName\',:daysCount');				

	$scope.chartHeight = window.innerHeight - 170;



    $scope.chartOptions = {
		responsive: true,
	    scaleLabel: "<%=value%> млрд. руб.",
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
		if ($scope.daysCount && $scope.curBank) {
			var datasetY = [];
			var datasetHistory = [];
			var datasetPredictionBalanced = [];
			var datasetPredictionShort = [];
			var datasetPredictionLong = [];
			if ($scope.daysCount > 60) {
				$scope.pageWidth = $scope.daysCount*20 + 'px';
			} else {
				$scope.pageWidth = (window.innerWidth - 300) + 'px';
			}
			$scope.dataResource.query({daysCount: $scope.daysCount, bankName: $scope.curBank.value}).$promise.then(function(data){
				angular.forEach(data, function(value){
					var date = new Date(value.dt);
					datasetY.push($scope.getDateString(date));
					if (value.history == 0 && datasetHistory[datasetHistory.length-1] != null) {
						datasetPredictionBalanced[datasetPredictionBalanced.length-1] = datasetHistory[datasetHistory.length-1];
						datasetPredictionShort[datasetPredictionShort.length-1] = datasetHistory[datasetHistory.length-1];
						datasetPredictionLong[datasetPredictionLong.length-1] = datasetHistory[datasetHistory.length-1];
					}
					datasetHistory.push(value.history == 0 ? null:value.history);
					datasetPredictionBalanced.push(value.predictionBalanced == 0 ? null:value.predictionBalanced);
					datasetPredictionLong.push(value.predictionLong == 0 ? null:value.predictionLong);
					datasetPredictionShort.push(value.predictionShort == 0 ? null:value.predictionShort);
				});
				if (datasetY.length == 0) {
					alert('Нет данных для отображения');
				} else {
					$scope.chartData  = {
						labels : datasetY,
						datasets : [
						  {
						  	label: 'История',
						    fillColor : "rgba(220,220,220,0.5)",
						    strokeColor : "rgba(220,220,220,1)",
						    pointColor : "rgba(220,220,220,1)",
						    pointStrokeColor : "#fff",
						    data : datasetHistory
						  },
						  {
						  	label: 'Предсказание на краткосрочный период',
						    fillColor : "rgba(52,73,94,0.5)",
						    strokeColor : "rgba(52,73,94,1)",
						    pointColor : "rgba(52,73,94,1)",
						    pointStrokeColor : "#fff",
						    data : datasetPredictionShort
		 				  },
		  				  {
						  	label: 'Предсказание на среднесрочный период',
						    fillColor : "rgba(26,188,156,0.5)",
						    strokeColor : "rgba(26,188,156,1)",
						    pointColor : "rgba(26,188,156,1)",
						    pointStrokeColor : "#fff",
						    data : datasetPredictionBalanced
						  },
		  				  {
						  	label: 'Предсказание на долгосрочный период',
						    fillColor : "rgba(151,187,205,0.5)",
						    strokeColor : "rgba(151,187,205,1)",
						    pointColor : "rgba(151,187,205,1)",
						    pointStrokeColor : "#fff",
						    data : datasetPredictionLong
						  }
						]
					};

				}
			}).catch(function(){ 
				alert('Произошла ошибка при загрузке данных с сервера, попробуйте выполнить операцию позднее.')
			});
		}	
	}

}]);