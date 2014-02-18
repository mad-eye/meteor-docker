var docker = Npm.require('docker.io')({ socketPath: '/var/run/docker.sock' });
var options = {}; // all options listed in the REST documentation for Docker are supported.

docker.containers.list(options /* optional*/, function(err, res) {
    if (err) throw err;
    console.log("data returned from Docker as JS object: ", res);
});
