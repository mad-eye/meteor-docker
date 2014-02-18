Package.describe({
    summary: "Start, stop, and monitor docker containers"
});

Npm.depends({"docker.io": "0.9.8"});

Package.on_use(function (api, where) {
    api.add_files(["server.js"], "server");
});
