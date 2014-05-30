docker = {};

var Docker = Npm.require('dockerode');
var exports = {};

var client = new Docker({
  version: "v1.11",
  host: "http://" + Meteor.settings.docker.host,
  port: parseInt(Meteor.settings.docker.port)
});

var _ = Npm.require("underscore");

var listContainers =  Meteor._wrapAsync(function(callback){
  client.listContainers(callback);
});

var createContainer = Meteor._wrapAsync(function(options, callback){
  client.createContainer(options, function(err, container){
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

      callback(null, container);
    }
  });
});

//e.g. createVolumeContainer("/app");
function createVolumeContainer(volume){
  var vols = {}
  vols[volume] = {};

  var volumeContainer = createContainer({
    Image: "ubuntu",
    Cmd: ['true'],
    "Volumes": vols
  });
  return volumeContainer;
};

//exports
docker.createContainer = createContainer;
docker.createVolumeContainer = createVolumeContainer;
docker.listContainers = listContainers;
docker.client = client;

