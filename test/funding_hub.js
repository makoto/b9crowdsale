'use strict';
var FundingHub = artifacts.require("FundingHub.sol");

contract('FundingHub', function(accounts) {
  var hub;
  var project;
  var owner = accounts[0];
  var backer = accounts[1];
  var another_backer = accounts[2];
  var title = 'My pet project';
  var targetAmount = parseInt(web3.toWei(10));
  var contribution = parseInt(web3.toWei(1));
  var a_day = 1 * 60 * 60 * 24 // 1 day
  var deadline = a_day * 8;

  describe('constructor', function(){
    // FundingHub.deployed()
  })

  /*
    This function should allow a user to add a new project to the FundingHub.
    The function should deploy a new Project contract and keep track of its address.
    The createProject() function should accept all constructor values that the Project contract requires.
  */
  describe('createProject', function(){
    it('registers new project', function(done){
      FundingHub.new()
        .then(function(_hub) {
          hub = _hub;
          return hub.createProject(title, targetAmount, deadline, {from:owner});
        })
        .then(function() {
          return hub.numOfProjects.call();
        })
        .then(function(num) {
          assert.strictEqual(num.toNumber(), 1);
        })
        .then(done);
    })
  })

  /*
    This function allows users to contribute to a Project identified by its address.
    contribute calls the fund() function in the individual Project contract
    and passes on all value attached to the function call.
  */
  describe('contribute', function(){
    it('contributes to a project', function(done){
      FundingHub.new()
        .then(function(_hub) {
          hub = _hub;
          return hub.createProject(title, targetAmount, deadline, {from:owner});
        })
        .then(function() {
          return hub.projects.call(0);
        })
        .then(function(project_address) {
          project = Project.at(project_address);
          return hub.contribute.sendTransaction(project_address, {value:contribution});
        })
        .then(function(project_address) {
          assert.equal(web3.eth.getBalance(project.address).toNumber(), contribution);
        })
        .then(done);
    })
  })
});
