var app = angular.module('fundingHubApp', []);

app.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});

app.controller("fundingHubController", [ '$scope', '$location', '$http', '$q', '$window', '$timeout', function($scope , $location, $http, $q, $window, $timeout) {
    // Everything else will come in here.
  $scope.accounts = [];
  $scope.account = "";
  $scope.balance = "";

  $scope.refreshProjects = function() {
     var hub = FundingHub.deployed();
     console.log('numOfProjects 1');
     hub.numOfProjects.call()
     .then(function(value) {
       console.log('numOfProjects 2', value);
       var allRequests = []; // Or {}
       console.log('value', value);
       for (index = 0; index < value; index++) {
           console.log(index);
           allRequests.push(hub.projects.call(index));
       }
       return $q.all(allRequests);
     }).then(function(resultsArray) {
       var allRequests = resultsArray.map(function(project_address){
         var project = Project.at(project_address);
         return project.detail.call();
       })
       return $q.all(allRequests);
     }).then(function(resultsArray) {
       var projects = resultsArray.map(function(detail){
         return {
           owner: detail[0],
           title: detail[1],
           target_amount: parseInt(web3.fromWei(detail[2], 'ether')),
           deadline: detail[3]
         }
       })
       console.log('projects', projects);
       $timeout(function () {
           $scope.projects = projects;
           $scope.numOfProjects = projects.length;
       });
     }).catch(function(e) {

     });
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
     var hub = FundingHub.deployed();
     hub.createProject.sendTransaction(title, web3.toWei(target_amount), deadline, {from: $scope.account, gas:1000000}).then(function() {
       console.log('hello');
       $scope.refreshProjects();
     }).catch(function(e) {
     });
  }
}]);
