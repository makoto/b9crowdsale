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
    detail = Detail(msg.sender, _title, _targetAmount, _deadline);
  }

  event EventLog(string message);
  event EventLog2(string message, uint one, uint two, uint three, uint four);

  function fund() payable{
    EventLog('FUND');
    if(msg.value <= 0) throw;
    var amount = msg.value;

    if(isComplete()){
      if(!msg.sender.send(amount)) throw;

      EventLog('isComplete');
      if(isSuccess() && this.balance > 0){
        EventLog('success');
        payout();
      }else{
        EventLog('failed');
        if(contributors[msg.sender].amount != 0){
          refund();
        }
      }
    }else{
      EventLog('NOT isComplete');
      EventLog2('hello', this.balance, amount, this.balance + amount, detail.targetAmount);
      if(this.balance > detail.targetAmount){
        var diff = this.balance - detail.targetAmount;
        amount = amount - diff;
        EventLog('Returning diff');
        if(!msg.sender.send(diff)) throw;
      }
      if(contributors[msg.sender].amount != 0){
        contributors[msg.sender].amount += contributors[msg.sender].amount;
      }else{
        contributors[msg.sender] = Contributor(msg.value, false);
      }
      if(isSuccess() && this.balance > 0){
        EventLog('success');
        payout();
      }else{
        EventLog('still going on');
      }
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
  */
  function payout() public{
    if(!isSuccess()) throw;
    asyncSend(owner, this.balance);
  }

  /*
    This function sends all individual contributions back to the respective contributor,
    or lets all contributors retrieve their contributions.
  */
  function refund() public{
    if(!isFailure()) throw;

    var contributor = contributors[msg.sender];
    if(contributor.amount == 0) throw;

    if (contributor.paid == false){
      contributor.paid = true;
      if(!msg.sender.send(contributor.amount)) throw;
    }
  }
}
