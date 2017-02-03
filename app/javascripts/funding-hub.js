hundingHubModule = angular.module('hundingHubModule', []);
hundingHubModule
  .component('hundingHub', {
    templateUrl: '/funding-hub.html',
    controller: function($scope , $location, $http, $q, $window, $timeout, EthereumService) {
        // Everything else will come in here.
      $scope.accounts = [];
      $scope.account = "";
      $scope.balance = "";
      console.log('fundingHub');
      $scope.refreshProjects = function() {
        EthereumService.refreshProjects()
          .then(function(projects){
            $timeout(function () {
                $scope.projects = projects;
                $scope.all_projects_count = projects.length;
                $scope.active_projects_count = projects.filter(function(p){ return p.result == 'pending' }).length;
            });
          })
      };

      EthereumService.getAccounts()
        .then(function(accounts){
          $timeout(function () {
            $scope.accounts = accounts;
            $scope.account = $scope.accounts[0];
            $scope.refreshProjects();
          });
        })

      $scope.createProject = function(title, target_amount, deadline) {
        var hub;
        FundingHub.deployed()
          .then(function(instance) {
            hub = instance;
            return hub.createProject.sendTransaction(web3.fromUtf8(title), web3.toWei(target_amount), deadline, {from: $scope.account, gas:1000000})
          })
          .then(function() {
           $scope.refreshProjects();
          }).catch(function(e) {
          });
      }
    }
})
