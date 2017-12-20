angular.
  module('coinDetail').
  component('coinDetail', {
    templateUrl: 'components/coin-detail/coin-detail.template.html',
    controller: ['$http', '$routeParams', '$interval',
      function CoinDetailController($http, $routeParams, $interval) {
        var self = this;
        this.name = $routeParams.coinId;
        this.progress = 0;
        this.oldPrice = 0;
        this.priceDiff = 0;

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
          self.oldPrice = self.coin.USD;
          console.log('Price:', self.oldPrice)
        });

        this.getData = function getData(){
          self.progress = 0;
          $http.get('https://min-api.cryptocompare.com/data/price?fsym=' + $routeParams.coinId + '&tsyms=USD').then(function(response) {
            self.coin = response.data;
            this.priceDiff = self.coin.USD - self.oldPrice;
            if (self.coin.USD >= self.oldPrice) {
              console.log('spread')              
            } else {
              console.log('loss')
            }
            console.log('old price:',self.oldPrice)
            console.log('actual price:', self.coin.USD)
            console.log('diff', this.priceDiff)
            self.oldPrice = self.coin.USD;
          });
        };
        
       this.intervalFunction = function intervalFunction(){
         $interval(function(){
           self.getData();
         }, 60000)
       };
       this.intervalFunction();
       
       this.click = function() {
        self.progress = 0;
        self.getData();
      };
    }
    ]
  });