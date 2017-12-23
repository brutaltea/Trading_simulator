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
        this.priceArchive = [];
        this.amountError = false;
        this.userMoney = 1000;
        this.userCrypto = 0;
        this.userCryptoOwn = 0;

        this.resetAmount = function resetAmount() {
          return this.amountError = false;
        }

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
          self.priceArchive.push({
            price: self.coin.USD,
            time: new Date()
          })
          console.log('Price:', self.oldPrice)
        });

        this.getData = function getData(){
          self.progress = 0;
          self.progressBar = 0;
          $http.get('https://min-api.cryptocompare.com/data/price?fsym=' + $routeParams.coinId + '&tsyms=USD')
          .then(function(response) {
            self.coin = response.data;
            self.priceArchive.push({
              price: self.coin.USD,
              time: new Date()
            })
            console.log(self.priceArchive)
            this.priceDiff = self.coin.USD - self.oldPrice;
            if (self.coin.USD >= self.oldPrice) {
              console.log('spread')
              self.upShow = true;
              self.downShow = false;
            } else {
              console.log('loss');
              self.upShow = false;
              self.downShow = true;
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
        self.progressBar = 0;
        self.getData();
      };

      this.buy = function buy() {
        if (!this.inputAmount){
          this.amountError = true;
          return
        } else {
          self.userCryptoOwn = self.inputAmount;
          self.cryptoToUsd = self.userCryptoOwn * self.coin.USD;
          self.result = function result(){

          }
        console.log(`buy ${this.inputAmount} of ${this.name}`);
        }
      };

     /* this.sell = function sell() {
        if (!this.inputAmount){
          this.amountError = true;
          return
        } else {
        console.log(`sell ${this.inputAmount} of ${this.name}`);
        }
      };*/

    }
  ]
});