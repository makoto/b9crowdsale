var ethereumModule = angular.module('ethereumModule', []);

function getStatus(number){
  return ['pending', 'success', 'failed'][number]
}

ethereumModule.factory('EthereumFactory', function($q){
  var factory = {};

  factory.refreshProjects = function() {
    return new Promise(function(resolve, reject){
      if (web3.version.network < 10) {
        FundingHub.setNetwork(web3.version.network);
      }
      var projects = [];
      var project_addresses = [];
      var hub;
      FundingHub.deployed()
        .then(function(instance) {
          hub = instance;
          return hub.numOfProjects.call()
        })
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
              project_id: project_addresses[index],
              owner: detail[0],
              title: web3.toUtf8(detail[1]),
              target_amount: parseFloat(web3.fromWei(detail[2], 'ether')),
              deadline_in_second: d,
              deadline_for_display: moment(d).fromNow(),
              contributors: detail[4].toNumber(),
              contributions: parseFloat(web3.fromWei(detail[5], 'ether')),
              result: getStatus(detail[6].toNumber()),
              ended: ended
            }
            projects[index].achivement = projects[index].contributions / projects[index].target_amount * 100;
          })
          resolve(projects)
        }).catch(function(e) {});
    })
  };

  factory.getAccounts = function(){
    return new Promise(function(resolve, reject){
      web3.eth.getAccounts(function(err, accs) {
        if (err) {
          reject(err);
        }else{
          resolve(accs);
        }
      });
    })
  }
  return factory;
})

ethereumModule.service('EthereumService', function(EthereumFactory){
  this.refreshProjects = EthereumFactory.refreshProjects;
  this.getAccounts = EthereumFactory.getAccounts;
})
