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

- Make payout function private = There is no need to call this function manually as it gets called by `fund` function as soon as the funding goal has been met.
