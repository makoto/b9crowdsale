# CrowdSale (Sample app)

## Github URL

https://github.com/makoto/b9crowdsale


## Prerequisite

- node
- testrpc (start it from its own terminal)
- truffle

## How to run the app.

```
git clone https://github.com/makoto/b9crowdsale
npm install
truffle migrate
truffle serve
open http://localhost:8080/
```

## Notes

- `payout` function is set to be private = There is no need to call this function manually as it gets called by `fund` function as soon as the funding goal has been met.
- `refund` function cannot be called unless project result is transitioned to `failed`. If status is `pending` even after the deadline is passed, call `fund` function to transition manually with any amount (the amount will be returned).
- `refund` function is called when someone tries to fund after deadline only if the person has funded before = we do not automatically refund to everybody when the project failed. Other contributors have to call `refund` manually.
