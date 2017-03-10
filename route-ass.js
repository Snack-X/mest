"use strict";

const fs = require("fs");

const parser = require("libjass");

const utils = require("./utils");

const padLeft = (str, len, ch = " ") => (ch.repeat(len) + str).substr(-len);

function parseTime(input) {
  let   ms = (input % 1) * 1000; input = ~~(input);
  let  sec = input % 60; input = ~~(input / 60);
  let  min = input % 60; input = ~~(input / 60);
  let hour = input;
  return padLeft(hour, 2, "0") + ":" +
         padLeft( min, 2, "0") + ":" +
         padLeft( sec, 2, "0") + "." +
         padLeft(  ms, 3, "0");
}

function* ass2vtt(assData) {
  let assParsed = yield parser.ASS.fromString(assData);

  let vttOutput = [ "WEBVTT\n" ];

  for(let dialogue of assParsed.dialogues) {
    let text = "";
    for(let part of dialogue.parts) {
      if(part instanceof parser.parts.Text) text += part.value;
      if(part instanceof parser.parts.NewLine) text += "\n";
    }

    let start = parseTime(dialogue.start);
    let end = parseTime(dialogue.end);

    vttOutput.push(`${start} --> ${end}`);
    vttOutput.push(text + "\n");
  }

  return vttOutput.join("\n");
}

module.exports = function* ass(reqPath = "") {
  let fullPath = utils.resolvePath(this, reqPath);
  let stat = fs.statSync(fullPath);

  if(stat.isFile() && reqPath.endsWith(".ass")) {
    this.type = "text/vtt";
    this.body = yield ass2vtt(fs.readFileSync(fullPath, "utf8"));
  }
  else this.throw(404);
};
