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

  modifier atPending(address sender){
    if(detail.result != resultTypes.pending){
      if(!sender.send(msg.value)) throw;
      EventContribution('Returned the value', msg.value, now, msg.sender, sender);
    }else{
      _;
    }
  }

  modifier atFailed(){
    if(detail.result != resultTypes.failed) throw;
    _;
  }

  modifier beforeDeadline(address sender){
    if(isTimedOut()){
      detail.result = resultTypes.failed;
      if(!sender.send(msg.value)) throw;
      EventContribution('Returned the value', msg.value, now, msg.sender, sender);
      if(contributors[sender].amount != 0) refund(sender);
    }else{
      _;
    }
  }

  /* Public functions */

  function Project(address _owner, bytes32 _title, uint _targetAmount, uint _deadline) {
    owner = _owner;
    if(_deadline <= 0) throw;
    if(_targetAmount <= 0) throw;
    detail = Detail(owner, _title, _targetAmount, now + _deadline, 0, 0, resultTypes.pending);
  }

  function fund(address sender) public payable notEmpty() atPending(sender) beforeDeadline(sender){
    var amount = msg.value;
    if(this.balance > detail.targetAmount){
      var diff = this.balance - detail.targetAmount;
      amount = amount - diff;
      if(!sender.send(diff)) throw;
      EventContribution('Returned the diff', diff, now, msg.sender, sender);
    }
    detail.contributions = this.balance;

    if(contributors[sender].amount != 0){
      contributors[sender].amount += amount;
    }else{
      detail.contributors=detail.contributors+1;
      contributors[sender] = Contributor(amount, false);
    }
    EventContribution('Contributed', amount, now, msg.sender, sender);
    if(isSuccess()) payout();
  }

  function refund(address sender) public atFailed(){
    var contributor = contributors[sender];
    if(contributor.amount == 0) throw;

    if (contributor.paid == false){
      contributor.paid = true;
      if(!sender.send(contributor.amount)) throw;
      EventContribution('Refunded', contributor.amount, now, msg.sender, sender);
    }else{
      EventContribution('Already refunded', 0, now, msg.sender, sender);
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
