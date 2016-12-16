'use strict';

contract('Project', function(accounts) {
  var project;
  var owner = accounts[0];
  var backer = accounts[1];
  var title = 'My pet project';
  var targetAmount = web3.toWei(10);
  var contribution = web3.toWei(1);
  var a_day = 1 * 60 * 60 * 24 // 1 day
  var deadline = a_day * 8;

  /*
    This is the function called when the FundingHub receives a contribution.
    The function must keep track of the contributor and the individual amount contributed.
    If the contribution was sent after the deadline of the project passed,
    or the full amount has been reached,
    the function must return the value to the originator of the transaction and
    call one of two functions.
    If the full funding amount has been reached, the function must call payout.
    If the deadline has passed without the funding goal being reached, the function must call refund.
  */
  describe('constructor', function(){
    it('creates new project', function(done){
      Project.new(title, targetAmount, deadline, {from:owner})
      .then(function(_project) {
        project = _project;
        return project.detail.call()
      })
      .then(function(detail) {
        assert.equal(detail[0], owner);
        assert.equal(web3.toUtf8(detail[1]), title);
        assert.equal(detail[2], targetAmount);
        assert.equal(detail[3], deadline);
      })
      .then(done);
    })
    it('does not allow zero deadline', function(done){
      Project.new(title, targetAmount, 0, {from:owner})
      .catch(function(error){
        assert.equal(error, 'Error: VM Exception while processing transaction: invalid JUMP');
      })
      .then(done);
    })

    it('does not allow empty or minus target', function(done){
      Project.new(title, 0, deadline, {from:owner})
      .catch(function(error){
        assert.equal(error, 'Error: VM Exception while processing transaction: invalid JUMP');
      })
      .then(done);
    })
    it('allows duplicate title')  // just for documentation purpose
    it('allows empty title')      // just for documentation purpose
  })

  describe('fund', function(){
    it('keeps track of contributor and contribution amount', function(done){
      Project.new(title, targetAmount, deadline, {from:owner})
      .then(function(_project) {
        project = _project;
        return project.fund.sendTransaction({from:backer, value:contribution});
      })
      .then(function() {
        assert.equal(web3.eth.getBalance(project.address).toString(), contribution.toString());
        return project.contributors.call(backer);
      })
      .then(function(contributor) {
        assert.equal(contributor.toString(), contribution);
      })
      .then(done);
    })

    it('does not allow zero contribution')
  })

  describe('payout', function(){
    it('payouts if the full funding amount has been reached')
  })

  describe('refund', function(){
    it("refunds the fund to the contributor if funding goal has not been reached")
  })
});
