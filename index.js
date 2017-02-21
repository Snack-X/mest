"use strict";

const fs = require("fs");
const path = require("path");

const koa = require("koa");
const koaStatic = require("koa-static");
const koaMount = require("koa-mount");
const koaSwig = require("koa-swig");

const _ = require("koa-route");

const config = require("./config");

//==============================================================================

let app = koa();

app.context.render = koaSwig({
  root: path.join(__dirname, "views"),
  cache: "memory",
  ext: "html",
});

app.context.mestRoot = config.mestRoot;

app.use(koaMount("/static", koaStatic(path.join(__dirname, "static"))));

app.use(_.get("/list/:path*", require("./route-list")));
app.use(_.get("/play/:path*", require("./route-play")));
app.use(_.get("/smi/:path*", require("./route-smi")));
app.use(_.get("/raw/:path*", require("./route-raw")));
app.use(_.get("/", function* () {
  this.redirect("/list");
}));

app.listen(config.mestPort, config.mestHost);

process.on("uncaughtException", e => { /* ¯\_(ツ)_/¯ */ });
