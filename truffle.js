module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js"
    ],
    "metaCoin.js": [
      '../node_modules/angular/angular.min.js',
      "javascripts/metaCoinController.js"
    ],
    "fundingHub.js": [
      '../node_modules/angular/angular.min.js',
      '../node_modules/moment/moment.js',
      "javascripts/fundingHubController.js"
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
