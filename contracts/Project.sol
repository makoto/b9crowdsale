pragma solidity ^0.4.2;

contract Project {
  Detail public detail;

  struct Detail{
    address owner;
    string title;
    string description;
    uint targetAmount;
    uint deadline;
  }

  struct Contributor{
    address contributorAddress;
    uint amount;
  }

  /*function Project(string _title, string _description, uint _targetAmount, uint _deadline) {*/
  function Project() {
    detail = Detail(msg.sender, 'title', 'desription', 1,1);
  }

  function fund(){}

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
