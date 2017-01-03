
projectDetailModeule = angular.module('projectDetailModeule', []);
projectDetailModeule
  .component('projectDetail', {
    templateUrl: '/project-detail.html',
    controller: function($scope , $location, $http, $q, $window, $timeout, $routeParams, EthereumService){
      $scope.project_id = $routeParams.id;
      $scope.refreshProjects = function() {
        EthereumService.refreshProjects()
          .then(function(projects){
            console.log('projects', projects)
            $timeout(function () {
              $scope.project = projects.filter(function(project){return project.project_id == $scope.project_id})[0];
              console.log('project', $scope.project)
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
