var Dockerode = Npm.require('dockerode');
var _ = Npm.require("underscore");

Docker = function (options){
  this.client = new Dockerode(options);
};

Docker.prototype.listContainers = Meteor._wrapAsync(function(callback){
  this.client.listContainers(callback);
});

Docker.prototype.createContainer = Meteor._wrapAsync(function(options, callback){
  this.client.createContainer(options, function(err, container){
    if (err){
      return callback(err)
    } else {
      //TODO do something cooler here and wrap all functions

      container._asyncAttach = container.attach;
      container.attach = Meteor._wrapAsync(function(options, callback){
        container._asyncAttach(options, callback);
      });

      container._asyncStart = container.start;
      container.start = Meteor._wrapAsync(function(options, callback){
        container._asyncStart(options, callback);
      });

      container._asyncInspect = container.inspect;
      container.inspect = Meteor._wrapAsync(function(callback){
        container._asyncInspect(callback);
      });

      callback(null, container);
    }
  });
});

Docker.prototype.createVolumeContainer = function(volume){
  var vols = {}
  vols[volume] = {};

  var volumeContainer = this.createContainer({
    Image: "busybox",
    Cmd: ['true'],
    "Volumes": vols
  });
  return volumeContainer;
};

Docker.prototype.stopContainer = Meteor._wrapAsync(function(containerId, callback){
  this.client.getContainer(containerId).stop(callback);
});
