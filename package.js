Package.describe({
    summary: "Start, stop, and monitor docker containers"
});

Npm.depends({"dockerode": "1.3.0"});

Package.on_use(function (api, where) {
  api.add_files(["server.js"], "server");
  api.export("docker", "server");
});
