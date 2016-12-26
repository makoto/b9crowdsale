var app = angular.module('fundingHubApp', ['ethereumModule']);

app.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});

app.controller("fundingHubController", [ '$scope', '$location', '$http', '$q', '$window', '$timeout', 'EthereumService', function($scope , $location, $http, $q, $window, $timeout, EthereumService) {
    // Everything else will come in here.
  $scope.accounts = [];
  $scope.account = "";
  $scope.balance = "";
  $scope.hub = FundingHub.deployed();

  $scope.refreshProjects = function() {
    EthereumService.refreshProjects()
      .then(function(projects){
        $timeout(function () {
            $scope.projects = projects;
            $scope.all_projects_count = projects.length;
            $scope.active_projects_count = projects.filter(function(p){ return !p.ended }).length;
        });
      })
  };

  $window.onload = function () {
     web3.eth.getAccounts(function(err, accs) {
         // Same as before
         $scope.accounts = accs;
         $scope.account = $scope.accounts[0];
         $scope.refreshProjects();
     });
  }

  $scope.createProject = function(title, target_amount, deadline) {
     $scope.hub.createProject.sendTransaction(title, web3.toWei(target_amount), deadline, {from: $scope.account, gas:1000000}).then(function() {
       $scope.refreshProjects();
     }).catch(function(e) {
     });
  }
}]);
