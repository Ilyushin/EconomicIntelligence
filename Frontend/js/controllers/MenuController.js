angular.module('contestControllers').controller('menuController',['$scope', 'MenuItem',
	function ($scope, MenuItem) {
		$scope.menuItems = {
			0: {
				route: '#/dollar-prediction-chart',
				name: 'Курс доллара на основе сбалансированного ARIMA/ARTXP',
				icon: 'fa fa-area-chart'
			},
			1: {
				route: '#/bank-prediction',
				name: 'Активы банка',
				icon: 'fa fa-area-chart'
			},
			2: {
				route: '#/company-capitalize',
				name: 'Оценка совокупного влияния курса доллара и стоимости нефти за 2013-2014 г.г.',
				icon: 'fa fa-table'
			},
			5: {
				route: '#/company-capitalize-fix-oil',
				name: 'Влияние стоимости доллара на капитализацию бизнеса',
				icon: 'fa fa-area-chart'
			},
			6: {
				route: '#/company-capitalize-fix-dollar',
				name: 'Влияние стоимости нефти на капитализацию бизнеса',
				icon: 'fa fa-area-chart'
			},
			7: {
				route: '#/stock-price-deviation',
				name: 'Анализ изменений курса акций',
				icon: 'fa fa-table',
			},
			8: {
				route: '#/manufacture-part',
				name: 'Доли отраслей в капитализации рынка',
				icon: 'fa fa-table',
			},
			4: {
				route: '#/manufacture',
				name: 'Статистика средневзвешнной стоимости акций по отрасли',
				icon: 'fa fa-area-chart'
			},
			999: {
				route: '#/about',
				name: 'О проекте',
				icon: 'fa fa-file-text-o'
			}
		};

		$scope.curItem = MenuItem.getKey();

		$scope.setItem = function(key) {
			$scope.curItem = key;
		}

		  $scope.$on('menuUpdate', function() {
		    $scope.curItem = MenuItem.getKey();
		  });
	}
]);
