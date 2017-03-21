var app = angular.module(
  'fundingHubApp', ['ngRoute', 'ethereumModule', 'hundingHubModule', 'projectDetailModeule']
);

app.config(function ($locationProvider, $routeProvider) {
  $routeProvider
    .when('/', {
      template: "<hunding-hub></hunding-hub>"
    })
    .when('/!/project/:id', {
      template: "<project-detail></project-detail>"
    })
    .otherwise({redirectTo:'/'})
});
