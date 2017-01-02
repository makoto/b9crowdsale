var ethereumModule = angular.module('ethereumModule', []);
ethereumModule.factory('EthereumFactory', function($q){
  var factory = {};

  factory.refreshProjects = function() {
    return new Promise(function(resolve, reject){
      var hub = FundingHub.deployed();
      var projects = [];
      var project_addresses = [];
      hub.numOfProjects.call()
        .then(function(value) {
          var allRequests = []; // Or {}
          for (index = 0; index < value; index++) {
            allRequests.push(hub.projects.call(index));
          }
          return $q.all(allRequests);
        }).then(function(resultsArray) {
          project_addresses = resultsArray;
          var allRequests = resultsArray.map(function(project_address){
            var project = Project.at(project_address);
            return project.detail.call();
          })
          return $q.all(allRequests);
        }).then(function(resultsArray) {
          resultsArray.forEach(function(detail, index){
            var d = new Date((detail[3]) * 1000);
            var ended = false;
            var now = new Date();
            if ((d - now) < 0 ) {
              ended = true;
            }
            projects[index] = {
              address: project_addresses[index],
              owner: detail[0],
              title: web3.toUtf8(detail[1]),
              target_amount: parseInt(web3.fromWei(detail[2], 'ether')),
              deadline_in_second: d,
              deadline_for_display: moment(d).fromNow(),
              ended: ended
            }
          })
          resolve(projects)
        }).catch(function(e) {});
    })
  };

  return factory;
})

ethereumModule.service('EthereumService', function(EthereumFactory){
  this.refreshProjects = EthereumFactory.refreshProjects;
})
