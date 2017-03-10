"use strict";

const fs = require("fs");
const path = require("path");
const getMIME = require("mime-types").lookup;
const utils = require("./utils");

module.exports = function* play(reqPath = "") {
  let fullPath = utils.resolvePath(this, reqPath);
  let stat = fs.statSync(fullPath);

  let filename;

  if(stat.isFile() && utils.isMedia(reqPath)) {
    let parsed = path.parse(reqPath);
    filename = parsed.dir + "/" + parsed.name;

    this.state.media = reqPath;
    this.state.mediaType = getMIME(parsed.base);

    if(utils.isAudio(reqPath)) this.state.type = "audio";
    else if(utils.isVideo(reqPath)) this.state.type = "video";
  }
  else this.throw(404);

  // Handle query `sub`
  let subType = this.query.sub || "";
  if(subType === "smi" || subType === "ass") {
    this.state.subType = subType;
    this.state.subtitle = filename + "." + subType;
  }

  yield this.render("play.html");
};
