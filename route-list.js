"use strict";

const fs = require("fs");
const path = require("path");
const utils = require("./utils");

module.exports = function* list(reqPath = "") {
  let fullPath = utils.resolvePath(this, reqPath);
  let stat = fs.statSync(fullPath);

  // Video files should go to play endpoint
  // Subtitle parameter is not passed
  if(stat.isFile() && utils.isMedia(reqPath)) {
    this.redirect("/play/" + reqPath);
    return;
  }

  // Ignore other things
  if(!stat.isDirectory()) this.throw(400);

  // Build file list
  let fileList = fs.readdirSync(fullPath);

  let entries = [];
  fileList.forEach(name => { try {
    if(name.startsWith(".")) return;

    let stat = fs.statSync(path.join(fullPath, name));

    let entry = {
      link: path.join(reqPath, name),
      name: name,
      date: stat.mtime,
    };

    if(stat.isDirectory()) {
      entry.type = "directory";
      entry.size = "-";
      entry.name += "/";
    }
    else if(stat.isFile() && utils.isMedia(name)) {
      entry.type = "file";
      entry.size = utils.formatSize(stat.size);
      entry.sub = [];

      // Find subtitle files
      let parsed = path.parse(name);
      let filename = parsed.name;
      if(fileList.includes(filename + ".smi")) entry.sub.push("smi");
      if(fileList.includes(filename + ".ass")) entry.sub.push("ass");
    }
    else return;

    entries.push(entry);
  } catch(e) { /* ¯\_(ツ)_/¯ */ } });

  this.state.directory = reqPath.replace(/\\/g, "/");
  this.state.entries = entries;

  yield this.render("list.html");
};
