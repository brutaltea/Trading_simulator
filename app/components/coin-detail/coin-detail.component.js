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
        this.upShow = false;
        this.downShow = false;
        this.progressBar = 0;
        this.logs = [];
        this.amountError = false;
        this.userMoney = 1000;
        this.userCrypto = 0;
        this.userCryptoOwn = 0;
        this.buyError = false;
        this.sellError = false;

        this.resetValidation = function resetValidation() {
          this.amountError = false;
          this.buyError = false;
          this.sellError = false;
        };

        this.addTologs = function addTologs(date, price, operation) {
          this.logs.unshift({
            price: price,
            time: date,
            operation: operation
          })
        };

        this.progressInterval = function() {
          $interval(function(){
            if (self.progress >= 100) {
              self.progress = 0;
              self.progressBar = 0;
              return self.progress;
            } else {
              self.progress = self.progress + 0.0167;
              self.progressBar = self.progressBar + 0.01;
              return self.progress;
            }
          }, 10)
        };
        this.progressInterval();

        $http.get('https://min-api.cryptocompare.com/data/price?fsym=' + $routeParams.coinId + '&tsyms=USD')
        .then(function(response) {
          self.coin = response.data;
          self.oldPrice = self.coin.USD;
          self.addTologs(new Date(), self.coin.USD, '');
        });

        this.getData = function getData(){
          self.progress = 0;
          self.progressBar = 0;
          $http.get('https://min-api.cryptocompare.com/data/price?fsym=' + $routeParams.coinId + '&tsyms=USD')
          .then(function(response) {
            self.coin = response.data;
            self.addTologs(new Date(), self.coin.USD, '');
            this.priceDiff = self.coin.USD - self.oldPrice;
            if (self.coin.USD >= self.oldPrice) {
              self.upShow = true;
              self.downShow = false;
            } else {
              self.upShow = false;
              self.downShow = true;
            }
            self.oldPrice = self.coin.USD;
          });
        };
        
       this.intervalFunction = function intervalFunction(){
         $interval(function(){
           self.getData();
         }, 60000)
       };
       this.intervalFunction();

      this.buy = function buy() {
        if (!this.inputAmount){
          this.amountError = true;
          return
        } else {
          if (this.inputAmount * this.coin.USD > this.userMoney) {
            this.buyError = true;
          } else { 
            this.addTologs(new Date(), self.coin.USD, 'Bought '+this.inputAmount+this.name);
            this.userCryptoOwn = this.inputAmount;
            this.cryptoToUsd = this.userCryptoOwn * self.coin.USD;
            this.userMoney = this.userMoney - this.cryptoToUsd;
          };
        };
        this.inputAmount = '';
      };

     this.sell = function sell() {
        if (!this.inputAmount){
          this.amountError = true;
          return
        } else {
          if (this.inputAmount > this.userCryptoOwn) {
            this.sellError = true;
          } else { 
            this.addTologs(new Date(), self.coin.USD, 'Sold '+this.inputAmount+this.name);
            this.userCryptoOwn = this.userCryptoOwn - this.inputAmount;
            this.userMoney = this.userMoney + this.inputAmount * this.coin.USD;
        };
      };
      this.inputAmount = '';
    };

  }
  ]
});