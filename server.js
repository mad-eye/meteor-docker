var Dockerode = Npm.require('dockerode');
var _ = Npm.require("underscore");

Docker = function (options){
  this.host = options.host;
  this.port = options.port;
  options.host = "http://" + options.host;
  this.client = new Dockerode(options);
};

Docker.prototype.getContainer = function(id){
  return asyncifyContainer(this.client.getContainer(id));
}

Docker.prototype.listContainers = Meteor._wrapAsync(function(callback){
  this.client.listContainers(callback);
});

Docker.prototype.createContainer = Meteor._wrapAsync(function(options, callback){
  this.client.createContainer(options, function(err, container){
    if (err){
      return callback(err)
    } else {
      asyncifyContainer(container);
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
  this.client.getContainer(containerId).stop(function(error, result){
    if (error){
      console.log(error.statusCode, error, result);
    }
    // console.log("ERROR", error);
    // console.log("RESULT", result);

    if (error && error.statusCode == 304){
      callback(null, result);
    } else if (error && error.statusCode == 404){
      console.log("Tried to stop container", containerId, "but it was not found running");
      callback(null, result);
    } else {
      callback(error, result);
    }
  });
});

Docker.prototype.removeContainer = Meteor._wrapAsync(function(containerId, callback){
  this.client.getContainer(containerId).remove(function(error, result){
    if (error){
      console.log(error.statusCode, error, result);
    }
    if (error && error.statusCode == 304){
      callback(null, result);
    } else if (error && error.statusCode == 404){
      console.log("Tried to remove container", containerId, "but it was not found");
      callback(null, result);
    } else {
      callback(error, result);
    }
  });
});


function asyncifyContainer(container){
  if (! container){
    return null;
  }

  //is there a slick way to wrap all the functions on container?

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

  return container;
}
