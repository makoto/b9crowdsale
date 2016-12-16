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
  var invalid_jump_error = 'Error: VM Exception while processing transaction: invalid JUMP';

  describe('constructor', function(){
    it('creates new project', function(done){
      Project.new(title, targetAmount, deadline, {from:owner})
      .then(function(_project) {
        project = _project;
        return project.detail.call()
      })
      .then(function(detail) {
        assert.strictEqual(detail[0], owner);
        assert.strictEqual(web3.toUtf8(detail[1]), title);
        assert.strictEqual(detail[2].toString(), targetAmount);
        assert.strictEqual(detail[3].toNumber(), deadline);
      })
      .then(done);
    })

    it('does not allow zero deadline', function(done){
      Project.new(title, targetAmount, 0, {from:owner})
      .catch(function(error){
        console.log('error', error.toString(), Object.prototype.toString(error))
        assert.strictEqual(error.toString(), invalid_jump_error);
      })
      .then(done);
    })

    it('does not allow empty or minus target', function(done){
      Project.new(title, 0, deadline, {from:owner})
      .catch(function(error){
        assert.strictEqual(error.toString(), invalid_jump_error);
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
        assert.strictEqual(web3.eth.getBalance(project.address).toString(), contribution.toString());
        return project.contributors.call(backer);
      })
      .then(function(contributor) {
        assert.strictEqual(contributor.toString(), contribution);
      })
      .then(done);
    })

    it('does not allow zero contribution', function(done){
      Project.new(title, targetAmount, deadline, {from:owner})
      .then(function(_project) {
        project = _project;
        return project.fund.sendTransaction({from:backer, value:0});
      })
      .catch(function(error){
        assert.strictEqual(error.toString(), invalid_jump_error);
      })
      .then(done);
    })
  })

  describe('payout', function(){
    it('payouts if the full funding amount has been reached')
  })

  describe('refund', function(){
    it("refunds the fund to the contributor if funding goal has not been reached")
  })
});
