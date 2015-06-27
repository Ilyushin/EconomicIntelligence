'use strict';

angular.module('contestApp',[
	'ngRoute',
	'contestControllers'
]).config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
		when('/dollar-prediction-chart', {
			templateUrl: 'partials/graph-by-days.html',
			controller: 'DollarPredictionController'
		}).
		when('/bank-prediction', {
			templateUrl: 'partials/graph-by-days-and-bank.html',
			controller: 'BankPredictionController'
		}).
		when('/manufacture', {
			templateUrl: 'partials/graph-by-manufacture.html',
			controller: 'ManufactureController'
		}).
		when('/company-capitalize', {
			templateUrl: 'partials/graph-company-capitalize.html',
			controller: 'CompanyCapitalizeController'
		}).
		when('/company-capitalize-fix-oil', {
			templateUrl: 'partials/graph-company-capitalize-fix-oil.html',
			controller: 'CompanyCapitalizeFixOilController'
		}).
		when('/company-capitalize-fix-dollar', {
			templateUrl: 'partials/graph-company-capitalize-fix-dollar.html',
			controller: 'CompanyCapitalizeFixDollarController'
		}).
		when('/stock-price-deviation', {
			templateUrl: 'partials/stock-price-deviation.html',
			controller: 'StockPriceDeviationController'
		}).
		when('/manufacture-part', {
			templateUrl: 'partials/manufacture-part.html',
			controller: 'ManufacturePartController'
		}).
		when('/about', {
			templateUrl: 'partials/about.html'
		}).
		otherwise({
			redirectTo: '/about'
		});
  }
]).factory('MenuItem', function ($rootScope) {

    var data = {
        key: 999
    };

    return {
        getKey: function () {
            return data.key;
        },
        setKey: function (key) {
            data.key = key;
            $rootScope.$broadcast("menuUpdate");
        }
    };
});;

angular.module('contestControllers',['tc.chartjs', 'mgcrea.ngStrap', 'ngResource']);
