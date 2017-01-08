pragma solidity ^0.4.2;
import 'zeppelin/Ownable.sol';

contract Project is Ownable{
  Detail public detail;
  uint public deadline;
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

  mapping(address => Contributor) public contributors;

  function Project(bytes32 _title, uint _targetAmount, uint _deadline) {
    if(_deadline <= 0) throw;
    if(_targetAmount <= 0) throw;
    detail = Detail(tx.origin, _title, _targetAmount, now + _deadline, 0, 0, resultTypes.pending);
  }

  event EventLog(string message);
  event EventContribution(bytes32 activity, uint amount, uint time, address contributorAddress, address originAddress);

  modifier notCompleted() {
    if (detail.result == resultTypes.pending) _;
  }

  modifier notEmpty(){
    if(msg.value <= 0) throw;
    _;
  }

  modifier pending(){
    if(detail.result != resultTypes.pending){
      if(!tx.origin.send(msg.value)) throw;
      EventContribution('Returned the value', msg.value, now, msg.sender, tx.origin);
    }else{
      _;
    }
  }

  modifier notTimedOut(){
    if(isTimedOut()){
      detail.result = resultTypes.failed;
      if(!tx.origin.send(msg.value)) throw;
      EventContribution('Returned the value', msg.value, now, msg.sender, tx.origin);
      if(contributors[tx.origin].amount != 0) refund();
    }else{
      _;
    }
  }

  function fund() public payable notEmpty() pending() notTimedOut(){
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

  function isTimedOut() constant returns(bool){
    return now > detail.deadline;
  }

  function isSuccess() constant returns(bool){
    return detail.contributions == detail.targetAmount;
  }

  /*
    This is the function that sends all funds received in the contract to the owner of the project.
    Will be called by fund().
  */
  function payout() private{
    detail.result = resultTypes.success;
    if(this.balance > 0){
      if(!owner.send(this.balance)) throw;
      EventContribution('Paid out',this.balance, now, msg.sender, owner);
    }
  }

  /*
    This function sends all individual contributions back to the respective contributor,
    or lets all contributors retrieve their contributions.
  */
  function refund() public{
    if(detail.result != resultTypes.failed) throw;
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
}
