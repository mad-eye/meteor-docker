Package.describe({
    summary: "Start, stop, and monitor docker containers"
});

Npm.depends({"dockerode": "1.2.9"});

Package.on_use(function (api, where) {
    api.add_files(["server.js"], "server");
});
