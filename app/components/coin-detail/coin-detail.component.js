angular.
  module('coinDetail').
  component('coinDetail', {
    templateUrl: 'components/coin-detail/coin-detail.template.html',
    controller: ['$http', '$routeParams', '$interval',
      function CoinDetailController($http, $routeParams, $interval) {
        var self = this;

        $http.get('https://min-api.cryptocompare.com/data/price?fsym=' + $routeParams.coinId + '&tsyms=USD').then(function(response) {
          self.coin = response.data;
        });

        this.getData = function getData(){
          $http.get('https://min-api.cryptocompare.com/data/price?fsym=' + $routeParams.coinId + '&tsyms=USD').then(function(response) {
            self.coin = response.data;
          });
        };
        
       this.intervalFunction = function intervalFunction(){
         $interval(function(){
           self.getData();
         }, 1000)
       };

       this.intervalFunction();

      }
    ]
  });