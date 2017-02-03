# CrowdSale (Sample app)

## Github URL

https://github.com/makoto/b9crowdsale

## Prerequisite

- node
- testrpc (v3)
- truffle (v3)

## How to run the app.

```
git clone https://github.com/makoto/b9crowdsale
npm install
truffle migrate --network development|testnet|mainnet
truffle serve
open http://localhost:8080/
```

## Demo

The demo video walk through of the following scenarios is on [youtube](https://youtu.be/YjyruoSmpv4)

### Funding succeeded

```
Given User 1 created a project with funding goal of 10 Ether
  And User 2 funded 5 Ether
When User 3 press 'contribute' with 10 Ether
Then User 3 receives 5 Ether back
  And User 1 receives 10 Ether
```

### Funding failed

```
Given User 1 created a project with funding goal of 10 Ether
  And User 2 funded 5 Ether
  And User 3 funded 2 Ether
  And Funding period ends
When User 3 press 'contribute' with 10 Ether
Then User 3 receives 10 Ether back
  And User 3 receives 2 Ether refund
When User 2 press 'refund'
Then User 2 receives 5 Ether
When User 2 press 'refund'
Then User 2 receives 0 Ether
```

## Notes

- `payout` function is set to be private = There is no need to call this function manually as it gets called by `fund` function as soon as the funding goal has been met.
- `refund` function cannot be called unless project result is transitioned to `failed`. If status is `pending` even after the deadline is passed, call `fund` function to transition manually with any amount (the amount will be returned).
- `refund` function is called when someone tries to fund after deadline only if the person has funded before = we do not automatically refund to everybody when the project failed. Other contributors have to call `refund` manually.
