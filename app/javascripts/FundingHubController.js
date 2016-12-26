var app = angular.module('fundingHubApp', []);

app.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});

app.controller("fundingHubController", [ '$scope', '$location', '$http', '$q', '$window', '$timeout', function($scope , $location, $http, $q, $window, $timeout) {
    // Everything else will come in here.
  $scope.accounts = [];
  $scope.account = "";
  $scope.balance = "";
  $scope.hub = FundingHub.deployed();;

  $scope.refreshProjects = function() {
     $scope.hub.numOfProjects.call()
     .then(function(value) {
       var allRequests = []; // Or {}
       for (index = 0; index < value; index++) {
         allRequests.push($scope.hub.projects.call(index));
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
         var d = new Date((detail[3]) * 1000);
         var ended = false;
         var now = new Date();
         if ((d - now) < 0 ) {
           ended = true;
         }
         return {
           owner: detail[0],
           title: web3.toUtf8(detail[1]),
           target_amount: parseInt(web3.fromWei(detail[2], 'ether')),
           deadline_in_second: d,
           deadline_for_display: moment(d).fromNow(),
           ended: ended
         }
       })
       console.log('projects', projects);
       console.log(projects.filter(function(p){ return !p.ended }));
       $timeout(function () {
           $scope.projects = projects;
           $scope.all_projects_count = projects.length;
           $scope.active_projects_count = projects.filter(function(p){ return !p.ended }).length;
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
     $scope.hub.createProject.sendTransaction(title, web3.toWei(target_amount), deadline, {from: $scope.account, gas:1000000}).then(function() {
       console.log('hello');
       $scope.refreshProjects();
     }).catch(function(e) {
     });
  }
}]);
