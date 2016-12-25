var app = angular.module('metaCoinApp', []);

app.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});

app.controller("metaCoinController", [ '$scope', '$location', '$http', '$q', '$window', '$timeout', function($scope , $location, $http, $q, $window, $timeout) {
    // Everything else will come in here.
  $scope.accounts = [];
  $scope.account = "";
  $scope.balance = "";

  $scope.refreshBalance = function() {
     var meta = MetaCoin.deployed();
     meta.getBalance.call($scope.account, {from: $scope.account})
     .then(function(value) {
         $timeout(function () {
             $scope.balance = value.valueOf();
         });
     }).catch(function(e) {

     });
  };

  $window.onload = function () {
     web3.eth.getAccounts(function(err, accs) {
         // Same as before
         $scope.accounts = accs;
         $scope.account = $scope.accounts[0];
         $scope.refreshBalance();
     });
  }

  $scope.sendCoin = function(amount, receiver) {
     var meta = MetaCoin.deployed();

     meta.sendCoin.sendTransaction(receiver, amount, {from: $scope.account}).then(function() {
       $scope.refreshBalance();
     }).catch(function(e) {
     });
  }

}]);
