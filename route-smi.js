"use strict";

const fs = require("fs");

const parser = require("sami-parser");
const chardet = require("chardet");
const iconv = require("iconv-lite");

const utils = require("./utils");

const padLeft = (str, len, ch = " ") => (ch.repeat(len) + str).substr(-len);

function parseTime(input) {
  let   ms = input % 1000; input = ~~(input / 1000);
  let  sec = input %   60; input = ~~(input /   60);
  let  min = input %   60; input = ~~(input /   60);
  let hour = input;
  return padLeft(hour, 2, "0") + ":" +
         padLeft( min, 2, "0") + ":" +
         padLeft( sec, 2, "0") + "." +
         padLeft(  ms, 3, "0");
}

function smi2vtt(rawData) {
  let encoding = chardet.detect(rawData);

  let smiData = iconv.decode(rawData, encoding);
  let smiParsed = parser.parse(smiData, {});

  let vttOutput = [ "WEBVTT\n" ];

  for(let segment of smiParsed.result) {
    let text = segment.languages.ko || segment.languages.kr ||
               segment.languages.en || "";
    let start = parseTime(segment.startTime);
    let end = parseTime(segment.endTime);

    vttOutput.push(`${start} --> ${end}`);
    vttOutput.push(text + "\n");
  }

  return vttOutput.join("\n");
}

module.exports = function* smi(reqPath = "") {
  let fullPath = utils.resolvePath(this, reqPath);
  let stat = fs.statSync(fullPath);

  if(stat.isFile() && reqPath.endsWith(".smi")) {
    this.type = "text/vtt";
    this.body = smi2vtt(fs.readFileSync(fullPath));
  }
  else this.throw(404);
};
