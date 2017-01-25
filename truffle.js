module.exports = {
  build: {
    "index.html": "index.html",
    "funding-hub.html": "funding-hub.html",
    "project-detail.html": "project-detail.html",
    "external.js": [
      '../node_modules/angular/angular.min.js',
      '../node_modules/angular-route/angular-route.min.js',
      '../node_modules/angular-resource/angular-resource.min.js',
      '../node_modules/moment/moment.js'
    ],
    "app.js": [
      "javascripts/app.js"
    ],
    "funding-hub.js": [
      "javascripts/app.js",
      'javascripts/ethereum-service.js',
      'javascripts/project-detail.js',
      'javascripts/funding-hub.js',
      'javascripts/config.js'
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  rpc: {
    host: "localhost",
    port: 8545
  },
  networks: {
    "mainnet": {
      network_id: 1 // Ethereum public network
    },
    "testnet":   {
      network_id: 3        // Official Ethereum test network
    },
    "development": {
      network_id: "default"
    }
  }
};
