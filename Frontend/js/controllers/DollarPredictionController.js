angular.module('contestControllers').controller('DollarPredictionController', ['$scope', '$resource', 'MenuItem', function ($scope, $resource, MenuItem) {

	$scope.pageWidth = '';

	MenuItem.setKey(0);

	$scope.chartHeight = window.innerHeight - 181;



	$scope.title = 'Предсказание курса доллара на основе данных за 2006 - 2014 года (Центробанк России). Включает два вида предсказания: "в прошлое" (historic prediction) и в будущее.';
	$scope.dataResource = $resource('http://test.iliushin.com:8081/api/analyse?query=exec dbo.spt_PredictTimeSeries_All :daysCount');				

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
		if ($scope.daysCount) {
			var datasetY = [];
			var datasetHistory = [];
			var datasetPrediction = [];
			var datasetFact = [];
			if ($scope.daysCount > 60) {
				$scope.pageWidth = $scope.daysCount*20 + 'px';
			} else {
				$scope.pageWidth = (window.innerWidth - 300) + 'px';
			}
			$scope.dataResource.query({daysCount: $scope.daysCount}).$promise.then(function(data){
				angular.forEach(data, function(value){
					var date = new Date(value.valueDate);
					datasetY.push($scope.getDateString(date));
					if (value.historicPrediction == 0 && datasetHistory[datasetHistory.length - 1] != null) {
						datasetPrediction[datasetPrediction.length - 1] = datasetHistory[datasetHistory.length - 1];
					}
					datasetHistory.push(value.historicPrediction == 0? null:value.historicPrediction);
					datasetPrediction.push(value.prediction == 0? null:value.prediction);
					datasetFact.push(value.factValue == 0? null:value.factValue);
				});
				$scope.chartData  = {
					labels : datasetY,
					datasets : [
					  {
					  	label: 'Предсказание в прошлое',
					    fillColor : "rgba(220,220,220,0.5)",
					    strokeColor : "rgba(220,220,220,1)",
					    pointColor : "rgba(220,220,220,1)",
					    pointStrokeColor : "#fff",
					    data : datasetHistory
					  },
					  {
					  	label: 'Предсказание в будущее',
					    fillColor : "rgba(151,187,205,0.5)",
					    strokeColor : "rgba(151,187,205,1)",
					    pointColor : "rgba(151,187,205,1)",
					    pointStrokeColor : "#fff",
					    data : datasetPrediction
					  },
	  				  {

					  	label: 'Фактическое значение',
			   			fillColor : "rgba(26,188,156,0.5)",
					    strokeColor : "rgba(26,188,156,1)",
					    pointColor : "rgba(26,188,156,1)",
					    pointStrokeColor : "#fff",
					    data : datasetFact
					  }
					]
				};
			}).catch(function(){ 
				alert('Произошла ошибка при загрузке данных с сервера, попробуйте выполнить операцию позднее.')
			});
		}	
		
	}

}]);