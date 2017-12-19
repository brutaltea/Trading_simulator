angular.
  module('coinDetail').
  component('coinDetail', {
    templateUrl: 'components/coin-detail/coin-detail.template.html',
    controller: ['$http', '$routeParams', '$interval',
      function CoinDetailController($http, $routeParams, $interval) {
        var self = this;
        this.name = $routeParams.coinId;
        this.progress = 0;

        this.progressInterval = function() {
          $interval(function(){
            if (self.progress >= 100) {
              self.progress = 0;
              return self.progress;
            } else {
              self.progress = self.progress + 1.7
              return self.progress;
            }
          }, 1000)
        };
        this.progressInterval();

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
           self.click();
         }, 60000)
       };
       this.intervalFunction();
       
       this.click = function() {
        $http.get('https://min-api.cryptocompare.com/data/price?fsym=' + $routeParams.coinId + '&tsyms=USD').then(function(response) {
            self.coin = response.data;
          });
          if (!this.userPrice) {
            return;
          } else if (this.userPrice >= self.coin.USD){
            console.log('bad')
          } else {
            console.log('good')
          }
       }

      }
    ]
  });