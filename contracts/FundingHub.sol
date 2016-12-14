pragma solidity ^0.4.2;

contract FundingHub {
  function FundingHub() {
    // constructor
  }

  /*
    This function should allow a user to add a new project to the FundingHub.
    The function should deploy a new Project contract and keep track of its address.
    The createProject() function should accept all constructor values that the Project contract requires.
  */
  function createProject();

  /*
    This function allows users to contribute to a Project identified by its address.
    contribute calls the fund() function in the individual Project contract
    and passes on all value attached to the function call.
  */
  function contribute();
}
