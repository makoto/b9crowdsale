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

  function fund() public payable{
    if(msg.value <= 0) throw;
    if(contributors[msg.sender].amount != 0){
      contributors[msg.sender].amount += contributors[msg.sender].amount;
    }else{
      contributors[msg.sender] = Contributor(msg.value, false);
    }
  }

  modifier auctionEnded{
    if(now < endDate) throw;
    _;
  }

  /*
    This is the function that sends all funds received in the contract to the owner of the project.
  */
  function payout() public auctionEnded{
    if(this.balance < detail.targetAmount) throw;
    asyncSend(owner, this.balance);
  }

  /*
    This function sends all individual contributions back to the respective contributor,
    or lets all contributors retrieve their contributions.
  */
  function refund() public auctionEnded {
    if(this.balance >= detail.targetAmount) throw;
    var contributor = contributors[msg.sender];
    if(contributor.amount == 0) throw;

    if (contributor.paid == false){
      contributor.paid = true;
      if(!msg.sender.send(contributor.amount)) throw;
    }
  }
}
