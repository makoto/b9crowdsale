pragma solidity ^0.4.2;
import 'zeppelin/PullPayment.sol';
import 'zeppelin/Ownable.sol';

contract Project is PullPayment, Ownable{
  Detail public detail;
  uint public endDate;
  struct Detail{
    address owner;
    bytes32 title;
    uint targetAmount;
    uint deadline;
  }

  struct Contributor{
    uint amount;
    bool paid;
  }

  mapping(address => Contributor) public contributors;

  function Project(bytes32 _title, uint _targetAmount, uint _deadline) {
    if(_deadline <= 0) throw;
    if(_targetAmount <= 0) throw;
    endDate = now + _deadline;
    detail = Detail(tx.origin, _title, _targetAmount, _deadline);
  }

  event EventLog(string message);
  function fund() public payable{
    if(msg.value <= 0) throw;
    var amount = msg.value;

    if(isComplete()){
      if(!tx.origin.send(amount)) throw;

      if(isSuccess()){
        payout();
      }else{
        if(contributors[tx.origin].amount != 0){
          refund();
        }
      }
    }else{
      if(this.balance > detail.targetAmount){
        var diff = this.balance - detail.targetAmount;
        amount = amount - diff;
        if(!tx.origin.send(diff)) throw;
      }
      if(contributors[tx.origin].amount != 0){
        contributors[tx.origin].amount += contributors[tx.origin].amount;
      }else{
        contributors[tx.origin] = Contributor(msg.value, false);
      }

      if(isSuccess()) payout();
    }
  }

  function isComplete() constant returns(bool){
    return now > endDate;
  }

  function isSuccess() constant returns(bool){
    return this.balance == detail.targetAmount;
  }

  function isFailure() constant returns(bool){
    return isComplete() && (this.balance < detail.targetAmount);
  }

  /*
    This is the function that sends all funds received in the contract to the owner of the project.
    Will be called by fund().
  */
  function payout() private{
    if(this.balance > 0) asyncSend(owner, this.balance);
  }

  /*
    This function sends all individual contributions back to the respective contributor,
    or lets all contributors retrieve their contributions.
  */
  function refund() public{
    if(!isFailure()) throw;

    var contributor = contributors[tx.origin];
    if(contributor.amount == 0) throw;

    if (contributor.paid == false){
      contributor.paid = true;
      if(!tx.origin.send(contributor.amount)) throw;
    }
  }
}
