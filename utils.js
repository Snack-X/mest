"use strict";

const fs = require("fs");
const path = require("path");

module.exports.isMedia = name => /\.(mp3|flac|ogg|mp4|webm)$/.test(name);
module.exports.isAudio = name => /\.(mp3|flac|ogg)$/.test(name);
module.exports.isVideo = name => /\.(mp4|webm)$/.test(name);
module.exports.isSubtitle = name => /\.(smi|ass)$/.test(name);

module.exports.resolvePath = (ctx, reqPath) => {
  // Resolve path
  let fullPath = path.join(ctx.mestRoot, reqPath);
  if(!fs.existsSync(fullPath)) ctx.throw(404);

  // Prevent directory traversal
  if(!fullPath.startsWith(ctx.mestRoot)) ctx.throw(400);

  return fullPath;
};

module.exports.formatSize = size => {
  let unit = ["", "KB", "MB", "GB", "TB"];
  let idx = 0;
  for(; idx < unit.length && size > 1024 ; size /= 1024, idx++) { }

  size = Math.round(size * 100) / 100;
  return "" + size + unit[idx];
};
