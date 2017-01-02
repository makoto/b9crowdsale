module.exports = {
  build: {
    "index.html": "index.html",
    "funding-hub.html": "funding-hub.html",
    "project-detail.html": "project-detail.html",
    "app.js": [
      "javascripts/app.js"
    ],
    "metaCoin.js": [
      '../node_modules/angular/angular.min.js',
      "javascripts/metaCoinController.js"
    ],
    "external.js": [
      '../node_modules/angular/angular.min.js',
      '../node_modules/angular-route/angular-route.min.js',
      '../node_modules/angular-resource/angular-resource.min.js',
      '../node_modules/moment/moment.js'
    ],
    "fundingHub.js": [
      'javascripts/EthereumService.js',
      'javascripts/FundingHubController.js'
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};
