angular.
  module('cryptoList').
  component('cryptoList', {
    templateUrl: 'components/crypto-list/crypto-list.template.html',
    controller: ['$http', function CryptoListController($http) {
      var self = this;

      $http.get('https://min-api.cryptocompare.com/data/all/coinlist')
        .then(function(response){
          var data = []
          for (var key in response.data.Data) {
            data.push(response.data.Data[key])
          }
          self.coins = data
        });

      }
    ]
  });