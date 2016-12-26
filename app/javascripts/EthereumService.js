var ethereumModule = angular.module('ethereumModule', []);

ethereumModule.factory('EthereumFactory', function(){
  var factory = {};
  factory.hello = function(name, cb){
    setTimeout(function(){
      console.log('world', name);
      cb(name);
    }, 1000)
    console.log('hello');
  }
  factory.asyncHello = function(name){
    return new Promise(function(resolve, reject){
      setTimeout(function(){
        console.log('world', name);
        resolve(name);
      }, 1000)
      console.log('hello');
    })
  }
  return factory;
})

ethereumModule.service('EthereumService', function(EthereumFactory){
  this.hello = EthereumFactory.hello;
  this.asyncHello = EthereumFactory.asyncHello;
})
