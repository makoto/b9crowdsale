projectDetailModeule = angular.module('projectDetailModeule', []);
projectDetailModeule
  .component('projectDetail', {
    templateUrl: '/project-detail.html',
    controller: function($scope , $location, $http, $q, $window, $timeout, $routeParams, EthereumService){
      $scope.project_id = $routeParams.id;
      $scope.refreshProjects = function() {
        EthereumService.refreshProjects()
          .then(function(projects){
            $timeout(function () {
              $scope.project = projects.filter(function(project){return project.project_id == $scope.project_id})[0];
            });
          })
      };

      $scope.contribute = function(account, amount){
        var hub;
        FundingHub.deployed()
          .then(function(instance) {
            hub = instance;
            return hub.contribute.sendTransaction($scope.project_id, {value:web3.toWei(amount), from: account, gas:1000000})
          })
          .then(function() {
            $scope.refreshProjects();
          }).catch(function(e) {});
      }

      $scope.refund = function(account){
        var hub;
        FundingHub.deployed()
          .then(function(instance) {
            hub = instance;
            return hub.refund.sendTransaction($scope.project_id, {from:account, gas:1000000})
          })
          .then(function() {
            $scope.refreshProjects();
          }).catch(function(e) {});
      }

      EthereumService.getAccounts()
        .then(function(accounts){
          $timeout(function () {
            $scope.accounts = accounts;
            $scope.account = $scope.accounts[0];
            $scope.refreshProjects();
          });
        })

      var event = Project.at($scope.project_id).allEvents({fromBlock:0})
      $scope.activities = [];
      event.watch(function(err,result) {
        if (result.event == 'EventContribution') {
          $timeout(function () {
            var activity = {
             activity: web3.toUtf8(result.args.activity),
             amount: parseFloat(web3.fromWei(result.args.amount, 'ether')),
             time:  moment(result.args.time * 1000).fromNow(),
             originAddress: result.args.originAddress
            }
            $scope.activities.push(activity);
          });
        }
      });
    }
  })
