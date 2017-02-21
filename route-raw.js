"use strict";

const fs = require("fs");
const send = require("koa-send");
const utils = require("./utils");

module.exports = function* raw(reqPath = "") {
  let fullPath = utils.resolvePath(this, reqPath);
  let stat = fs.statSync(fullPath);

  // .smi and .mp4 files are sended
  if(stat.isFile() && (utils.isMedia(reqPath) || utils.isSubtitle(reqPath)))
    yield send(this, reqPath, { root: this.mestRoot });
  else this.throw(404);
};
