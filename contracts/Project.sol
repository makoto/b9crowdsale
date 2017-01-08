pragma solidity ^0.4.2;

contract Project{
  /* Public variables */

  address public owner;
  Detail public detail;
  uint public deadline;
  mapping(address => Contributor) public contributors;

  /* Data types */

  enum resultTypes { pending, success, failed }
  struct Detail{
    address owner;
    bytes32 title;
    uint targetAmount;
    uint deadline;
    uint contributors;
    uint contributions;
    resultTypes result;
  }

  struct Contributor{
    uint amount;
    bool paid;
  }

  /* Events */

  event EventContribution(bytes32 activity, uint amount, uint time, address contributorAddress, address originAddress);

  /* Modifiers */

  modifier notCompleted() {
    if (detail.result == resultTypes.pending) _;
  }

  modifier notEmpty(){
    if(msg.value <= 0) throw;
    _;
  }

  modifier atPending(){
    if(detail.result != resultTypes.pending){
      if(!tx.origin.send(msg.value)) throw;
      EventContribution('Returned the value', msg.value, now, msg.sender, tx.origin);
    }else{
      _;
    }
  }

  modifier atFailed(){
    if(detail.result != resultTypes.failed) throw;
    _;
  }

  modifier beforeDeadline(){
    if(isTimedOut()){
      detail.result = resultTypes.failed;
      if(!tx.origin.send(msg.value)) throw;
      EventContribution('Returned the value', msg.value, now, msg.sender, tx.origin);
      if(contributors[tx.origin].amount != 0) refund();
    }else{
      _;
    }
  }

  /* Public functions */

  function Project(bytes32 _title, uint _targetAmount, uint _deadline) {
    owner = tx.origin;
    if(_deadline <= 0) throw;
    if(_targetAmount <= 0) throw;
    detail = Detail(tx.origin, _title, _targetAmount, now + _deadline, 0, 0, resultTypes.pending);
  }

  function fund() public payable notEmpty() atPending() beforeDeadline(){
    var amount = msg.value;
    if(this.balance > detail.targetAmount){
      var diff = this.balance - detail.targetAmount;
      amount = amount - diff;
      if(!tx.origin.send(diff)) throw;
      EventContribution('Returned the diff', diff, now, msg.sender, tx.origin);
    }
    detail.contributions = this.balance;

    if(contributors[tx.origin].amount != 0){
      contributors[tx.origin].amount += amount;
    }else{
      detail.contributors=detail.contributors+1;
      contributors[tx.origin] = Contributor(amount, false);
    }
    EventContribution('Contributed', amount, now, msg.sender, tx.origin);
    if(isSuccess()) payout();
  }

  function refund() public atFailed(){
    var contributor = contributors[tx.origin];
    if(contributor.amount == 0) throw;

    if (contributor.paid == false){
      contributor.paid = true;
      if(!tx.origin.send(contributor.amount)) throw;
      EventContribution('Refunded', contributor.amount, now, msg.sender, tx.origin);
    }else{
      EventContribution('Already refunded', 0, now, msg.sender, tx.origin);
    }
  }

  /* Private functions  */

  function payout() private{
    detail.result = resultTypes.success;
    if(this.balance > 0){
      if(!owner.send(this.balance)) throw;
      EventContribution('Paid out', detail.contributions, now, msg.sender, owner);
    }
  }

  /* Constants */

  function isTimedOut() constant returns(bool){
    return now > detail.deadline;
  }

  function isSuccess() constant returns(bool){
    return detail.contributions == detail.targetAmount;
  }
}
