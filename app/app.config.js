angular.
  module('priceCheckerApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {

      $routeProvider.
        when('/', {
          template: '<crypto-list></crypto-list>'
        }).
        when('/:coinId', {
          template: '<coin-detail></coin-detail>'
        }).
        otherwise('/');
    }
  ]);