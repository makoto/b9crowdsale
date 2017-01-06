
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
        var hub = FundingHub.deployed();
        console.log('account', $scope.account);
        hub.contribute.sendTransaction($scope.project_id, {value:web3.toWei(amount), from: account, gas:1000000}).then(function() {
          $scope.refreshProjects();
        }).catch(function(e) {});
      }

      $scope.refund = function(account){
        var project = Project.at($scope.project_id);
        project.refund.sendTransaction({from: account, gas:1000000}).then(function() {
          $scope.refreshProjects();
        }).catch(function(e) {});
      }

      $scope.withdrawPayments = function(account){
        var project = Project.at($scope.project_id);
        project.withdrawPayments.sendTransaction({from: account, gas:1000000}).then(function() {
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
      $scope.contributors = [];
      event.watch(function(err,result) {
        if (result.event == 'EventContribution') {
          $timeout(function () {
            var obj = {
             activity: web3.toUtf8(result.args.activity),
             amount: parseFloat(web3.fromWei(result.args.amount, 'ether')),
             time:  moment(result.args.time * 1000).fromNow(),
             originAddress: result.args.originAddress
            }
            $scope.contributors.push(obj);
          });
        }
      });
    }
  })

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
        var hub = FundingHub.deployed();

         hub.createProject.sendTransaction(title, web3.toWei(target_amount), deadline, {from: $scope.account, gas:1000000}).then(function() {
           $scope.refreshProjects();
         }).catch(function(e) {
         });
      }
    }
})

var app = angular.module('fundingHubApp', ['ngRoute', 'ethereumModule', 'hundingHubModule', 'projectDetailModeule']);

app.config(function ($locationProvider, $routeProvider) {
  $routeProvider
    .when('/', {
      template: "<hunding-hub></hunding-hub>"
    })
    .when('/project/:id', {
      template: "<project-detail></project-detail>"
    })
    .otherwise({redirectTo:'/'})
});
