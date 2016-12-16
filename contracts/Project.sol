pragma solidity ^0.4.2;

contract Project {
  Detail public detail;

  struct Detail{
    address owner;
    bytes32 title;
    uint targetAmount;
    uint deadline;
  }

  struct Contributor{
    uint amount;
  }

  mapping(address => Contributor) public contributors;

  function Project(bytes32 _title, uint _targetAmount, uint _deadline) {
    if(_deadline <= 0) throw;
    if(_targetAmount <= 0) throw;
    detail = Detail(msg.sender, _title, _targetAmount, _deadline);
  }

  function fund() payable{
    if(msg.value <= 0) throw;
    contributors[msg.sender] = Contributor(msg.value);
  }

  /*
    This is the function that sends all funds received in the contract to the owner of the project.
  */
  function payout(){}

  /*
    This function sends all individual contributions back to the respective contributor,
    or lets all contributors retrieve their contributions.
  */
  function refund(){}
}
