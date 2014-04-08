var Docker = Npm.require('dockerode');
var docker = new Docker({host: 'http://127.0.0.1', port: 4243});

var _ = Npm.require("underscore");
var util = Npm.require("util");
var StringDecoder = Npm.require('string_decoder').StringDecoder;
var Transform = Npm.require('stream').Transform;
util.inherits(JSONParseStream, Transform);


var JUST_GIT_IMAGE="517facc3c4f9";
var MADEYE_IMAGE="30ec8f3cc7f7";
var TEST_REPO="https://github.com/mad-eye/meteor-mocha-web.git";

var listContainers =  Meteor._wrapAsync(function(callback){
  docker.listContainers(callback);
});

// var containers = listContainers();
// console.log("CONTAINERS ARE", containers);

var run = Meteor._wrapAsync(function(img, cmd, stream, callback){
  docker.run(img, cmd, stream, function(err, data, container){
    callback(err, {data: data, container: container});
  });
});

// //based mostly off of stream example at bottom of 
// //http://nodejs.org/api/stream.html#stream_state_objects
function JSONParseStream(options){
  if (!this instanceof JSONParseStream)
	  return new JSONParseStream(options);

  Transform.call(this, options);
  this._writableState.objectMode = false;
  this._readableState.objectMode = true;
  this._buffer = '';
  this._decoder = new StringDecoder('utf8');
}

JSONParseStream.prototype._transform = function(chunk, encoding, cb) {
    this._buffer += this._decoder.write(chunk);
    //split on newlines
    var lines = this._buffer.split(/\r?\n/);
    this._buffer = lines.pop();
    for (var l = 0; l < lines.length; l++) {
	var line = lines[l];
	try {
	    var obj = JSON.parse(line);
	} catch (err) {
	    console.warn("Unable to parse", line);
	    continue;
	}
	// push the parsed object out to the readable consumer
	this.push(obj);
    }
    cb();
};

JSONParseStream.prototype._flush = function(cb){
    var rem = this._buffer.trim();
    if (rem) {
	try {
	    var obj = JSON.parse(rem);
	} catch (err){
	    this.emit('error', err);
	    return;
	}
	this.push(obj);
    }
    cb();
};

var myStream = new JSONParseStream();
myStream.on("data", function(data){
    console.log("I GOT DATA", data);
//    console.log("TYPE OF DATA", typeof data);
});


// function createVolumeContainer(repo){
//     var volumeContainer = createContainer(
// 	{"Image":JUST_GIT_IMAGE,
// 	 "Cmd": ["git", "clone", repo],
// 	 "WorkingDir":"/repos",
// 	 "Volumes": {
// 	     "/repos":{}
// 	 }});
//     _logOutput(volumeContainer.Id);
//     startContainer(volumeContainer.Id);
//     //wait for container to finish cloning
//     var result = waitContainer(volumeContainer.Id);
//     if (result.StatusCode != 0){
// 	console.error("ERROR CREATING VOLUME CONTAINER", result);
//     }

//     console.log("VOLUME CONTAINER ID", volumeContainer.Id);
//     return volumeContainer;
// }

// function createMadEyeContainer(volumeContainerId){
//     var madEyeContainer = createContainer(
// 	{"Image": MADEYE_IMAGE,
// 	 "Cmd": ["echo", '{"json":"yeah"}'],
// //	 "Cmd": ["madeye"],
// 	 "WorkingDir":"/repos/meteor-mocha-web",
// 	 "VolumesFrom": volumeContainerId
// 	})
//     captureOutput(madEyeContainer.Id);
//     startContainer(madEyeContainer.Id);
// }

// Meteor.startup(function(){
//     //TODO turn this into a Meteor method
//     //f(repoPath){return projectId}
//     volumeContainer = createVolumeContainer(TEST_REPO);
//     madeyeContainer = createMadEyeContainer(volumeContainer.Id);
// });

// /*completely untested publish code
// var publishers = [];
// var publishedContainers;

// Meteor.publish("containers", function(){
//     var self = this;
//     publishedContainers.forEach(function(container){
// 	self.added(container);
//     });
//     publishers.push(self);
//     self.ready()
// });

// Meteor.setInterval(function(){
//     containers = listContainers();
//     containers.forEach(function(container){
// 	//continue if the container already has been created
// 	if(publishedContainers[container.Id]){
// 	    return
// 	}
// 	else {
// 	    publishers.forEach(function(publisher){
// //example		self.added("counts", roomId, {count: count});
// //example removed self.removed("counts", roomId)
// //don't worry about changes to start

// 		publisher.added(container
// 	    }
// 	    publishedContainers[container.Id] = 
// 	}

// 	var containerModel = Containers.findOne(container.Id)
// 	if (containerModel){
// 	    console.log("container already exists");
// 	    return;
// 	}
// 	else {
// 	    container._id = container.Id;
// 	    delete container.Id;
// 	    delete container.Status;
// 	    Containers.insert(container);
// 	}
//     });
// }, 5000);

// */
