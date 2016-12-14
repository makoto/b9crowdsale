pragma solidity ^0.4.2;

contract Project {
  function Project() {
    // constructor
  }

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
  function fund();

  /*
    This is the function that sends all funds received in the contract to the owner of the project.
  */
  function payout();

  /*
    This function sends all individual contributions back to the respective contributor,
    or lets all contributors retrieve their contributions.
  */
  function refund();
}
