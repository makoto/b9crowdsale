contract('Project', function(accounts) {

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
    it.only('creates new project', function(done){
      var project;
      var owner = accounts[0];
      var title = 'My pet project';
      var targetAmount = web3.toWei(100);
      var a_day = 1 * 60 * 60 * 24 // 1 day
      var deadline = a_day * 8;
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
  })

  describe('fund', function(){
    it('keeps track of contributor and contribution amount', function(done){
    })
  })

  describe('payout', function(){
    it('payouts if the full funding amount has been reached')
  })

  describe('refund', function(){
    it("refunds the fund to the contributor if funding goal has not been reached", function(done) {

    });
  })
});
