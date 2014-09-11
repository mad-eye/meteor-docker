Package.describe({
    summary: "Start, stop, and monitor docker containers"
});

Npm.depends({"dockerode": "2.0.2"});

Package.on_use(function (api, where) {
  api.add_files(["server.js"], "server");
  api.export("Docker", "server");
});
